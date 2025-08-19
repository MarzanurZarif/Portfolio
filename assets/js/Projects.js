function loadProjects() {
    return {
        search: '',
        filter: 'all',
        projects: [],
        init() {
            fetch("Projects.json")
                .then(res => res.json())
                .then(data => {
                    this.projects = data;
                    const params = new URLSearchParams(window.location.search);
                    if (params.has('search')) {
                        this.search = params.get('search').replace(/"/g, '');
                    }
                });
        },
        filteredProjects() {
            if (this.projects.length > 0) {
                return this.projects.filter(p => {
                    if (p && p.id) {

                        let filterTerm = this.filter.toLowerCase();
                        let matchesFilter = filterTerm == 'all' || (p.languages && p.languages.some(lang => lang.toLowerCase().includes(filterTerm))) ||
                            (p.tags && p.tags.some(tag => tag.toLowerCase().includes(filterTerm)));

                        let searchTerm = this.search.toLowerCase();
                        let matchesSearch = searchTerm == 'all' || searchTerm == '' ||
                            p.id.toString().toLowerCase().includes(searchTerm) ||
                            p.title.toLowerCase().includes(searchTerm) ||
                            p.description.toLowerCase().includes(searchTerm) ||
                            (p.languages && p.languages.some(lang => lang.toLowerCase().includes(searchTerm))) ||
                            (p.tags && p.tags.some(tag => tag.toLowerCase().includes(searchTerm)));

                        return matchesFilter && matchesSearch;
                    }
                });
            }
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        const params = new URLSearchParams(window.location.search);
        if (params.has('search')) {
            searchInput.value = params.get('search').replace(/"/g, '');
        }
        searchInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                searchInput.blur();
                document.getElementById("overlay-bg").click();
            }
        });
        const searchButton = document.getElementById("form-search-btn")
        if (searchButton) {
            searchButton.onclick = function () {
                searchInput.blur();
                document.getElementById("overlay-bg").click();
            }
        }
    }
});