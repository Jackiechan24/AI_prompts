import {defineConfig} from "eslint/config";
import next from "eslint-config-next/core-web-vitals";
export default defineConfig([...next,{ignores:[".next/**","node_modules/**","artifacts/**","releases/**"]},{files:["scripts/*.cjs"],languageOptions:{sourceType:"commonjs",globals:{console:"readonly",process:"readonly",Buffer:"readonly",__dirname:"readonly"}},rules:{"@typescript-eslint/no-require-imports":"off"}}]);
