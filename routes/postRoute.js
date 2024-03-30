const express = require("express");
const router = express.Router();

const post_controller = require("../controllers/postController");

router.get("/", post_controller.post_list);
router.get("/:id", post_controller.post_detail);

router.get("/create", post_controller.post_create_get);
router.post("/create", post_controller.post_create_post);

router.get("/:id/update", post_controller.post_update_get);
router.post("/:id/update", post_controller.post_update_post);

router.get("/:id/delete", post_controller.post_delete_get);
router.post("/:id/delete", post_controller.post_delete_post);

module.exports = router;
