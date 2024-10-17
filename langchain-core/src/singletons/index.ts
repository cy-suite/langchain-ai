/* eslint-disable @typescript-eslint/no-explicit-any */
import { RunTree } from "langsmith";
import { CallbackManager } from "../callbacks/manager.js";
import { LangChainTracer } from "../tracers/tracer_langchain.js";

export interface AsyncLocalStorageInterface {
  getStore: () => any | undefined;

  run: <T>(store: any, callback: () => T) => T;

  enterWith: (store: any) => void;
}

export class MockAsyncLocalStorage implements AsyncLocalStorageInterface {
  getStore(): any {
    return undefined;
  }

  run<T>(_store: any, callback: () => T): T {
    return callback();
  }

  enterWith(_store: any) {
    return undefined;
  }
}

const mockAsyncLocalStorage = new MockAsyncLocalStorage();

const TRACING_ALS_KEY = Symbol.for("ls:tracing_async_local_storage");
const LC_CHILD_KEY = Symbol.for("lc:child_config");

export const _CONTEXT_VARIABLES_KEY = Symbol.for("lc:context_variables");

class AsyncLocalStorageProvider {
  getInstance(): AsyncLocalStorageInterface {
    return (globalThis as any)[TRACING_ALS_KEY] ?? mockAsyncLocalStorage;
  }

  getRunnableConfig() {
    const storage = this.getInstance();
    // this has the runnable config
    // which means that we should also have an instance of a LangChainTracer
    // with the run map prepopulated
    return storage.getStore()?.extra?.[LC_CHILD_KEY];
  }

  runWithConfig<T>(
    config: any,
    callback: () => T,
    avoidCreatingRootRunTree?: boolean
  ): T {
    const callbackManager = CallbackManager._configureSync(
      config?.callbacks,
      undefined,
      config?.tags,
      undefined,
      config?.metadata
    );
    const storage = this.getInstance();
    const previousValue = storage.getStore();
    const parentRunId = callbackManager?.getParentRunId();

    const langChainTracer = callbackManager?.handlers?.find(
      (handler) => handler?.name === "langchain_tracer"
    ) as LangChainTracer | undefined;

    let runTree;
    if (langChainTracer && parentRunId) {
      runTree = langChainTracer.convertToRunTree(parentRunId);
    } else if (!avoidCreatingRootRunTree) {
      runTree = new RunTree({
        name: "<runnable_lambda>",
        tracingEnabled: false,
      });
    }

    if (runTree) {
      runTree.extra = { ...runTree.extra, [LC_CHILD_KEY]: config };
    }

    if (
      previousValue !== undefined &&
      previousValue[_CONTEXT_VARIABLES_KEY] !== undefined
    ) {
      (runTree as any)[_CONTEXT_VARIABLES_KEY] =
        previousValue[_CONTEXT_VARIABLES_KEY];
    }

    return storage.run(runTree, callback);
  }

  initializeGlobalInstance(instance: AsyncLocalStorageInterface) {
    if ((globalThis as any)[TRACING_ALS_KEY] === undefined) {
      (globalThis as any)[TRACING_ALS_KEY] = instance;
    }
  }
}

const AsyncLocalStorageProviderSingleton = new AsyncLocalStorageProvider();

export { AsyncLocalStorageProviderSingleton };
