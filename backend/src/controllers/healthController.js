// Health-check controller.
// Provides a simple endpoint for monitoring / load-balancer checks
// and for the frontend to verify the API is reachable.

export function getHealth(_req, res) {
  res.json({
    success: true,
    message: 'AI Career Companion API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  })
}
