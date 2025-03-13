router.get("/home", (req, res) => {
    res.render("home");
});

router.get("/admin", (req, res) => {
    res.render("admin");
});