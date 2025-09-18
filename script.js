document.addEventListener('DOMContentLoaded', () => {
    const constellationSpace = document.querySelectorAll('.constellation-space');
    const directionLabel = document.getElementById('direction-label');
    let lastScrollY = window.scrollY;
    let lastScrollX = window.scrollX;

    constellationSpace.forEach(wrapper => {
        const infoDiv = wrapper.querySelector('.zodiac-info');
        const sign = wrapper.id;
        let isFetching = false;
        let fetchedData = null;

        wrapper.addEventListener('mouseenter', async () => {
            infoDiv.style.display = 'block';

            if (fetchedData) {
                infoDiv.innerHTML = fetchedData;
                setTimeout(() => infoDiv.style.opacity = 1, 10);
                return;
            }

            if (isFetching) return;
            isFetching = true;

            try {
                const proxyUrl = 'https://api.allorigins.win/raw?url=';
                const targetUrl = `https://astrostyle.com/horoscopes/daily/${sign}/`;
                const response = await fetch(proxyUrl + encodeURIComponent(targetUrl));

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const html = await response.text();

                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

                const horoscopeTextElement = doc.querySelector('.horoscope-content');
                const dateElement = doc.querySelector('div.horoscope-meta-top h4.date');

                let horoscopeText = horoscopeTextElement ? horoscopeTextElement.textContent.trim() : 'Horoscope not found.';
                let dateText = dateElement ? dateElement.textContent.trim() : '';

                fetchedData = `<h3>${dateText}</h3><p>${horoscopeText}</p>`;
                infoDiv.innerHTML = fetchedData;

                setTimeout(() => infoDiv.style.opacity = 1, 10);

            } catch (error) {
                console.error('Error fetching data:', error);
                infoDiv.innerHTML = '<p>Error loading horoscope.</p>';
            } finally {
                isFetching = false;
            }
        });

        wrapper.addEventListener('mouseleave', () => {
            infoDiv.style.opacity = 0;
            setTimeout(() => infoDiv.style.display = 'none', 500);
        });
    });

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        const currentScrollX = window.scrollX;

        if (currentScrollY > lastScrollY) {
            directionLabel.textContent = 'South ↓';
            directionLabel.style.opacity = 1;
        } else if (currentScrollY < lastScrollY) {
            directionLabel.textContent = 'North ↑';
            directionLabel.style.opacity = 1;
        }

        if (currentScrollX > lastScrollX) {
            directionLabel.textContent = 'East →';
            directionLabel.style.opacity = 1;
        } else if (currentScrollX < lastScrollX) {
            directionLabel.textContent = 'West ←';
            directionLabel.style.opacity = 1;
        }

        clearTimeout(window.scrollTimeout);
        window.scrollTimeout = setTimeout(() => {
            directionLabel.style.opacity = 0;
        }, 500);

        lastScrollY = currentScrollY;
        lastScrollX = currentScrollX;
    });
});