// api/data.js
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Điền trực tiếp thông tin repo của bạn tại đây
  const GITHUB_TOKEN = process.env.GH_TOKEN ? process.env.GH_TOKEN.trim() : "";
  const OWNER = "kietpm12-droid"; 
  const REPO = "app-t-c-nghi-p-u6b5";
  const PATH = "data/customers.json";

  const ghUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}`;

  // GET: Đọc dữ liệu
  if (req.method === 'GET') {
    try {
      const response = await fetch(ghUrl, {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'User-Agent': 'Vercel-Serverless-Function'
        }
      });

      if (response.status === 404) {
        return res.status(200).json({ sha: null, data: [] });
      }

      const fileData = await response.json();
      
      if (!response.ok) {
        return res.status(response.status).json({ error: fileData.message || "Lỗi GitHub API" });
      }

      const base64Content = fileData.content.replace(/\n/g, '');
      const jsonString = Buffer.from(base64Content, 'base64').toString('utf-8');
      
      return res.status(200).json({
        sha: fileData.sha,
        data: JSON.parse(jsonString)
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // POST: Thêm mới dữ liệu
  if (req.method === 'POST') {
    try {
      const newCustomer = req.body;
      let currentSha = null;
      let currentData = [];

      const getRes = await fetch(ghUrl, {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'User-Agent': 'Vercel-Serverless-Function'
        }
      });

      if (getRes.status === 200) {
        const fileData = await getRes.json();
        currentSha = fileData.sha;
        const base64Content = fileData.content.replace(/\n/g, '');
        const jsonString = Buffer.from(base64Content, 'base64').toString('utf-8');
        currentData = JSON.parse(jsonString);
      }

      currentData.push(newCustomer);

      const updatedContent = Buffer.from(JSON.stringify(currentData, null, 2), 'utf-8').toString('base64');

      const putRes = await fetch(ghUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
          'User-Agent': 'Vercel-Serverless-Function'
        },
        body: JSON.stringify({
          message: `Thêm KH: ${newCustomer.fullname}`,
          content: updatedContent,
          sha: currentSha || undefined
        })
      });

      const putData = await putRes.json();

      if (putRes.ok) {
        return res.status(200).json({ success: true, message: "Lưu thành công!" });
      } else {
        return res.status(putRes.status).json({ error: putData.message });
      }

    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
