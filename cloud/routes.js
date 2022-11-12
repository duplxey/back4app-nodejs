const {TwingEnvironment, TwingLoaderFilesystem} = require("twing");
let loader = new TwingLoaderFilesystem(__dirname + "/views");
let twing = new TwingEnvironment(loader);

app.get("/", async (req, res) => {
    try {
        let tasks = [];
        const query = new Parse.Query("Task");
        await query.each(task => tasks.push(task.toJSON()), {});

        twing.render("index.twig", {
            "tasks": tasks,
        }).then(out => res.send(out));
    } catch (error) {
        twing.render("error.twig", {
            "error": error,
        }).then(out => res.send(out));
    }
})

app.get("/create", async (req, res) => {
    twing.render("create.twig").then(out => res.send(out));
});

app.post("/create", async (req, res) => {
    const name = req.body.name;
    const description = req.body.description;
    const isDone = !!req.body.isDone;

    try {
        const task = new Parse.Object("Task");
        task.set("name", name);
        task.set("description", description);
        task.set("isDone", isDone);
        await task.save();

        res.redirect("/" + task.id);
    } catch (error) {
        twing.render("error.twig", {
            "error": error,
        }).then(out => res.send(out));
    }
});

app.get("/:objectId", async (req, res) => {
    const objectId = req.params.objectId;

    try {
        const query = new Parse.Query("Task");
        const task = await query.get(objectId);

        twing.render("task.twig", {
            "task": task.toJSON(),
        }).then(out => res.send(out));
    } catch (error) {
        twing.render("error.twig", {
            "error": error,
        }).then(out => res.send(out));
    }
});

app.get("/:objectId/toggle", async (req, res) => {
    const objectId = req.params.objectId;

    try {
        const query = new Parse.Query("Task");
        const task = await query.get(objectId);
        task.set("isDone", !task.get("isDone"))
        await task.save();

        res.redirect("/" + task.id);
    } catch (error) {
        twing.render("error.twig", {
            "error": error,
        }).then(out => res.send(out));
    }
});

app.get("/:objectId/delete", async (req, res) => {
    const objectId = req.params.objectId;

    try {
        const query = new Parse.Query("Task");
        const task = await query.get(objectId);
        await task.destroy();

        res.redirect("/");
    } catch (error) {
        twing.render("error.twig", {
            "error": error,
        }).then(out => res.send(out));
    }
});