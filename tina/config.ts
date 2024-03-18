import { defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch =
	process.env.GITHUB_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || process.env.HEAD || "main";

export default defineConfig({
	branch,

	// Get this from tina.io
	clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
	// Get this from tina.io
	token: process.env.TINA_TOKEN,

	build: {
		outputFolder: "admin",
		publicFolder: "public",
	},
	media: {
		tina: {
			mediaRoot: "",
			publicFolder: "public",
		},
	},
	// See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/schema/
	schema: {
		collections: [
			{
				name: "post",
				label: "Posts",
				path: "/src/content/post",
				fields: [
					{
						type: "string",
						name: "title",
						label: "Title",
						isTitle: true,
						required: true,
					},
					{
						type: "string",
						name: "description",
						label: "Description",
						required: true,
					},
					{
						type: "datetime",
						name: "publishDate",
						label: "Publish Date",
						required: true,
					},
					{
						type: "string",
						name: "updatedDate",
						label: "Updated Date",
						required: true,
					},
					{
						type: "rich-text",
						name: "body",
						label: "Body",
						isBody: true,
					},
					{
						type: "object",
						name: "coverImage",
						label: "Cover Image",
						required: false,
						fields: [
							{ label: "Source", name: "src", type: "image" },
							{ label: "Alt", name: "alt", type: "string" },
						],
					},
					{
						type: "boolean",
						name: "draft",
						label: "Draft",
						required: false,
					},
					{
						type: "string",
						name: "tags",
						label: "Tags",
						list: true,
						required: false,
					},
				],
			},
		],
	},
});
