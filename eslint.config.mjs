import type { Config } from "eslint"

const config: Config = {
  extends: ["next/core-web-vitals"],
  rules: {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}

export default config
