const express = require('express');
const linkPreviewJS = require('link-preview-js');
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
	res.send('Welcome to MAX-PREVIEW REST API!!');
});

app.get('/preview/', (req, res) => {
	let url = req.query.url;
	url = url.trim();
	console.log('url: ', url);
	res.set({
		"Content-Type": "application/json",
		"Access-Control-Allow-Origin": "*",
	});
	if (!url.startsWith('http://') && !url.startsWith('https://')) url = 'http://' + url;
	console.log('url after if: ', url);
	try {
		linkPreviewJS.getLinkPreview(url, {
			followRedirects: `manual`,
			handleRedirects: (baseURL, forwardedURL) => {
				const urlObj = new URL(baseURL);
				const forwardedURLObj = new URL(forwardedURL);
				if (
					forwardedURLObj.hostname === urlObj.hostname ||
					forwardedURLObj.hostname === "www." + urlObj.hostname ||
					"www." + forwardedURLObj.hostname === urlObj.hostname
				) {
					return true;
				} else {
					return false;
				}
			}
		}).then((data) => {
			res.send(data)
		});
	} catch (error) {
		res.error(error);
	}
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}..`));
