export const config = {
  runtime: 'nodejs18.x',
};

// Vercel serverless function - can be empty as Next.js handles routing
export default function handler(req, res) {
  res.status(200).json({ message: 'PULSE is running!' });
}
