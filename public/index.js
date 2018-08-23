const API_URL = 'https://piosk-api.herokuapp.com/v1/kiosk/view'

let currentPages = []
let currentPage

const fetchKiosks = async () => {
	try {
		console.log('fetchKiosks');

		const kiosk = await fetch(API_URL, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': window.__kiosk_token
			}
		}).then(response => response.json())
		.catch(e => {throw e})

		updatePages(kiosk)

		setTimeout(fetchKiosks, 10000)
		// fetch again later
	} catch (e) {
		// check error
		// retry if necessary
		console.error(e)
	}
}

const updatePages = (kiosk) => {
	console.log('updatePages');
	currentPages = kiosk.pages.reduce((arr, page, i) => {
		if (isPageUnchanged(page)) {
			arr.push(page)
			return arr
		}

		arr.push(updatePage(page, i))
		return arr
	}, [])

	cleanUp()
	startIf()
}

const updatePage = ({ url, time }, index) => {
	console.log('updatePage');
	const page = getPageByUrl(url)
	if (page) {
		return { url, time }
	}

	insertPage(url, index)
	return { url, time }
}

const isPageUnchanged = ({ url, time }) => {
	const page = getPageByUrl(url)

	if (!page) return false;

	return page.url === url && page.time === time;
}

const getPageByUrl = (url) => {
	return currentPages.find((page) => page.url === url)
}

const getNextPageOfUrl = (url) => {
	const index = currentPages.findIndex((page) => page.url === url)

	if (!currentPages[index + 1]) return currentPages[0]

	return currentPages[index + 1]
}

const insertPage = (url, index) => {
	const frame = document.createElement('iframe')
	frame.src = url
	frame.className = 'hidden'

	const container = document.querySelector('.piosk--container')
	const frames = container.querySelectorAll('iframe')

	if (frames.length < 1 || !frames[index]) {
		container.appendChild(frame)
		return
	}
}

const cleanUp = () => {
	const displayedPages = Array.from(document.querySelectorAll('.piosk--container iframe'))
		.map((frame) => frame.getAttribute('src'))

	const pagesToRemove = displayedPages.reduce((arr, url) => {

		if (currentPages.findIndex(page => page.url === url) < 0) {
			arr.push(url)
		}
		return arr
	}, [])

	for (let url of pagesToRemove) {
		document.querySelector(`.piosk--container iframe[src="${url}"]`).remove()
	}
}

const startIf = () => {
	if (currentPage) return;

	currentPage = currentPages[0].url
	setFrameActive(currentPages[0].url)

	//setTimeout(cycle, currentPages[0].time * 1000)
	setTimeout(cycle, 2 * 1000)
}

const cycle = () => {
	console.log('cycle');

	const next = getNextPageOfUrl(currentPage)

	setFrameActive(next.url)
	currentPage = next.url
	//setTimeout(cycle, next.time * 1000)
	setTimeout(cycle, 2 * 1000)
}

const setFrameActive = (url) => {
	const container = document.querySelector('.piosk--container')
	for (let frame of container.querySelectorAll('iframe')){
		frame.className = 'hidden'
	}
	container.querySelector(`iframe[src="${url}"]`).className = ''
}

(async () => {
	await fetchKiosks()
})()