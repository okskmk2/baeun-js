const routes = [
    {
        path: "",
        component: "components/home.html"
    },
    {
        path: "townhall",
        component: "components/townhall.html"
    },
    {
        path: "workspace",
        component: "components/workspace.html"
    },
    {
        path: "myspace",
        component: "components/myspace.html",
        children: [
            {
                path: "",
                component: "components/myspace/profile.html"
            },
            {
                path: "profile",
                component: "components/myspace/profile.html"
            },            
            {
                path: "goal",
                component: "components/myspace/goal.html"
            },
            {
                path: "todo",
                component: "components/myspace/todo.html"
            },
            {
                path: "note",
                component: "components/myspace/note.html"
            },
        ]
    },
];