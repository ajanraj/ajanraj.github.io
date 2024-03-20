import { defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch =
	process.env.GITHUB_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || process.env.HEAD || "main";

export default defineConfig({
	branch,

	// Get this from tina.io
	clientId: process.env.TINA_PUBLIC_CLIENT_ID,
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
				defaultItem: () => {
					return {
						// When a new post is created the title field will be set to "New post"
						title: "New Post",
						description: "What happened in my life on 18th March 2024. A short recap",
						publishDate: new Date().toISOString(),
						updatedDate:
							new Date().getDate() +
							" " +
							new Date().toLocaleString("default", { month: "short" }) +
							" " +
							new Date().getFullYear(),
						filename_gen:
							new Date().toLocaleString("default", { month: "long" }) +
							"-" +
							new Date().getDate() +
							"-" +
							new Date().toLocaleString("default", { year: "2-digit" }),
						tags: [
							new Date().toLocaleString("default", { month: "long" }).toLowerCase(),
							String(new Date().getFullYear()),
						],
					};
				},
				ui: {
					filename: {
						readonly: false,
						slugify: (values) => {
							// Values is an object containing all the values of the form. In this case it is {title?: string, topic?: string}
							return `${values?.filename_gen?.replace(/[^a-z^A-Z^0-9]/g, "-") || "no-topic"}/index`;
						},
					},
				},
				fields: [
					{
						type: "string",
						name: "title",
						label: "Title",
						isTitle: true,
						required: true,
						ui: {
							validate: (value, data) => {
								const lengthOfTitle = data?.title?.length || 0;
								if (lengthOfTitle >= 60) {
									return "The description must be shorter than 60 characters";
								}
							},
						},
					},
					{
						type: "string",
						name: "description",
						label: "Description",
						required: true,
						ui: {
							validate: (value, data) => {
								const lengthOfDescription = data?.description?.length || 0;
								if (lengthOfDescription <= 50) {
									return "The description must be longer than 50 characters";
								} else if (lengthOfDescription >= 160) {
									return "The description must be shorter than 160 characters";
								}
							},
						},
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
						description: "If this is checked the post will not be published",
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
	search: {
		tina: {
			indexerToken: process.env.TINASEARCH,
			stopwordLanguages: ["eng"],
		},
		indexBatchSize: 50,
		maxSearchIndexFieldLength: 100,
	},
});
