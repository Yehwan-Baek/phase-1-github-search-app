document.addEventListener("DOMContentLoaded",()=>{
    const form = document.querySelector("#github-form");
    const searchInput = document.querySelector("#search");
    const div = document.querySelector("#github-container")
    const userList = document.querySelector("#user-list");
    const repoList = document.querySelector("#repos-list");
    const btn = document.createElement("button") // to toggle the searching bar...

    let searchType = 'user';
    

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        let searchValue = searchInput.value;
        

        if (searchType === 'user') {
            searchUser(searchValue);
        } else if (searchType === 'repo') {
            searchRepo(searchValue);
        }
    });

    function searchUser (searchValue) {
        fetch(`https://api.github.com/search/users?q=${searchValue}`, {
        headers: {
            Accept: 'application/vnd.github.v3+json'
            }
        })
        .then( (res) => res.json())
        .then( (data) => {
            let users = data.items;
            userList.innerHTML=' ';
            users.forEach( (user) => {
                let li = document.createElement('li');
                let avatar = document.createElement('img');
                avatar.src = user.avatar_url;
                avatar.width = 50;
                avatar.height = 50;
                let username = document.createElement('a');
                username.href = user.html_url;
                username.target = '_blank';
                username.innerHTML = user.login;
                li.appendChild(avatar);
                li.appendChild(username);
                userList.appendChild(li);

                username.addEventListener('click', (e) => {
                    e.preventDefault();
                    const username = user.login;
                    fetch(`https://api.github.com/users/${username}/repos`, {
                        headers: {
                            Accept: 'application/vnd.github.v3+json'
                            }
                        })
                    .then((res)=>res.json())
                    .then( (data) => {
                        let repos = data;
                        repoList.innerHTML = ' ';
                        repos.forEach((repo) => {
                            const li = document.createElement('li');
                            const repoLink = document.createElement('a');
                            repoLink.href = repo.html_url;
                            repoLink.target = '_blank';
                            repoLink.innerHTML = repo.name;
                            li.appendChild(repoLink);
                            repoList.appendChild(li);   
                        })
                    })
                })
            })    
        })
    };

    function searchRepo (searchValue) {
        fetch(`https://api.github.com/search/repositories?q=${searchValue}`, {
            headers: {
                Accept: 'application/vnd.github.v3+json'
                }
            })
        .then( (res) => res.json())
        .then( (data) => {
            const repos = data.items;
            repoList.innerHTML = ' ';
            repos.forEach((repo) => {
                const li = document.createElement('li');
                const repoLink = document.createElement('a');
                repoLink.href = repo.html_url;
                repoLink.target = '_blank';
                repoLink.innerHTML = repo.name;
                li.appendChild(repoLink);
                repoList.appendChild(li);
            })
        })
    };

    btn.innerHTML = 'Toggle Search Type';
    form.appendChild(btn);

    btn.addEventListener("click", (e) => {
        e.preventDefault();
        if (searchType === 'user') {
            searchType = 'repo';
            btn.innerHTML = 'Search For Users'
            searchInput.placeholder = 'Search For Repositories';
        } else if (searchType === 'repo') {
            searchType = 'user';
            btn.innerHTML = 'Search For Repositories'
            searchInput.placeholder = 'Search For Users'
        }
    })
})

