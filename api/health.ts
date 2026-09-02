export const config = { 
    runtime: 'nodejs18.x',
  }; 
     
  export default function handler(_req: any, res: any) {
    res.status(200).json({ message: 'PULSE is running!' });
  }
