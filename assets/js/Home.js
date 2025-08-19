function FeaturedProjects() {
    return {
        projects: [],
        init() {
            fetch("Projects.json")
                .then(res => res.json())
                .then(data => {
                    this.projects = data;
                });
        },
        filteredProjects() {
            if (this.projects.length > 0) {
                return this.projects.filter(p => {
                    if (p && p.id) {
                        let matchesFilter = p.featured === true;
                        return matchesFilter;
                    }
                });
            }
        }
    }
}