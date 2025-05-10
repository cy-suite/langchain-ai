import { defineConfig } from "tsup";
export default defineConfig({
  // Entry points - adjust for your package structure
  entry: [
    "src/agents.ts",
    "src/caches/base.ts",
    "src/callbacks/base.ts",
    "src/callbacks/dispatch/index.ts",
    "src/callbacks/dispatch/web.ts",
    "src/callbacks/manager.ts",
    "src/callbacks/promises.ts",
    "src/chat_history.ts",
    "src/context.ts",
    "src/documents/index.ts",
    "src/document_loaders/base.ts",
    "src/document_loaders/langsmith.ts",
    "src/embeddings.ts",
    "src/example_selectors/index.ts",
    "src/indexing/index.ts",
    "src/language_models/base.ts",
    "src/language_models/chat_models.ts",
    "src/language_models/llms.ts",
    "src/load/index.ts",
    "src/load/serializable.ts",
    "src/memory.ts",
    "src/messages/index.ts",
    "src/messages/tool.ts",
    "src/output_parsers/index.ts",
    "src/output_parsers/openai_tools/index.ts",
    "src/output_parsers/openai_functions/index.ts",
    "src/outputs.ts",
    "src/prompts/index.ts",
    "src/prompt_values.ts",
    "src/runnables/index.ts",
    "src/runnables/graph.ts",
    "src/runnables/remote.ts",
    "src/retrievers/index.ts",
    "src/retrievers/document_compressors/base.ts",
    "src/singletons/index.ts",
    "src/stores.ts",
    "src/structured_query/index.ts",
    "src/tools/index.ts",
    "src/tracers/base.ts",
    "src/tracers/console.ts",
    "src/tracers/initialize.ts",
    "src/tracers/log_stream.ts",
    "src/tracers/run_collector.ts",
    "src/tracers/tracer_langchain.ts",
    "src/tracers/tracer_langchain_v1.ts",
    "src/types/stream.ts",
    "src/utils/async_caller.ts",
    "src/utils/chunk_array.ts",
    "src/utils/env.ts",
    "src/utils/event_source_parse.ts",
    "src/utils/function_calling.ts",
    "src/utils/hash.ts",
    "src/utils/json_patch.ts",
    "src/utils/json_schema.ts",
    "src/utils/math.ts",
    "src/utils/stream.ts",
    "src/utils/testing/index.ts",
    "src/utils/tiktoken.ts",
    "src/utils/types/index.ts",
    "src/vectorstores.ts",
  ],
  // Output both ESM and CJS formats
  format: ["esm", "cjs"],
  // Generate declaration files
  dts: true,
  // enable treeshaking
  treeshake: "safest",
  // Generate sourcemaps
  sourcemap: true,
  // Clean output directory before build
  clean: true,
  // Specify output directory
  outDir: "dist",
  // Set output extension based on format
  outExtension({ format }) {
    return {
      js: format === "esm" ? ".js" : ".cjs",
    };
  },
  // Ensure all external dependencies are properly excluded from the bundle
  // These will be taken from package.json dependencies/peerDependencies
  external: [],
});
