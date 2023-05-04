import type { Address, Expression, ExpressionAdapter, PublicSharing, LanguageContext, AgentService } from "https://esm.sh/@perspect3vism/ad4m@0.3.4";
import { join } from "https://deno.land/std@0.184.0/path/mod.ts";
import { exists } from "https://deno.land/std@0.184.0/fs/mod.ts";

class SharedPerspectivePutAdapter implements PublicSharing {
  #agent: AgentService;
  #storagePath: string;

  constructor(context: LanguageContext) {
    this.#agent = context.agent;
    //@ts-ignore
    if ("storagePath" in context.customSettings) { this.#storagePath = context.customSettings["storagePath"] } else { this.#storagePath = "./tst-tmp/" };
  }

  async createPublic(neighbourhood: object): Promise<Address> {
    const expression = this.#agent.createSignedExpression(neighbourhood);
    const content = JSON.stringify(expression);
    // @ts-ignore
    const address = UTILS.hash(content);

    const neighbourhoodPath = join(this.#storagePath, `neighbourhood-${address}.json`);
    console.log("Writing neighbourhood with path: ", neighbourhoodPath);
    Deno.writeTextFileSync(neighbourhoodPath, content);

    return address
  }
}

export default class Adapter implements ExpressionAdapter {
  #storagePath: string;

  putAdapter: PublicSharing;

  constructor(context: LanguageContext) {
    this.putAdapter = new SharedPerspectivePutAdapter(context);
    //@ts-ignore
    if ("storagePath" in context.customSettings) { this.#storagePath = context.customSettings["storagePath"] } else { this.#storagePath = "./tst-tmp/" };
  }

  async get(address: Address): Promise<Expression> {
    const neighbourhoodPath = join(this.#storagePath, `neighbourhood-${address}.json`)
    try {
      await exists(neighbourhoodPath)
      const neighbourhood = JSON.parse(Deno.readTextFileSync(neighbourhoodPath).toString());
      console.log("Found neighbourhood: ", neighbourhood);
      return neighbourhood
    } catch {
      return null
    } 
  }
}
