import type { NextConfig } from "next";

// No output: "standalone" — the runner image installs full production
// dependencies (not the pruned/traced subset standalone mode produces) so
// the same image can also run db:migrate/db:seed via tsx, which standalone's
// trace never picks up since those scripts aren't part of the app's route
// tree.
const nextConfig: NextConfig = {};

export default nextConfig;
