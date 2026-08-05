import { app } from "./app.js";
import config from "./infrastructure/config/env.index.js";

const PORT = config.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
