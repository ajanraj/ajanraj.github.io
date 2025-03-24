// tina/config.ts
import { defineConfig } from "tinacms";
var branch = process.env.GITHUB_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || process.env.HEAD || "main";
function getDaySuffix(day) {
  if (day >= 11 && day <= 13) {
    return "th";
  }
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}
var config_default = defineConfig({
  branch,
  // Get this from tina.io
  clientId: process.env.TINA_PUBLIC_CLIENT_ID || null,
  // Get this from tina.io
  token: process.env.TINA_TOKEN || null,
  build: {
    outputFolder: "admin",
    publicFolder: "public"
  },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "public"
    }
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
            description: "What happened in my life on " + (/* @__PURE__ */ new Date()).getDate() + getDaySuffix((/* @__PURE__ */ new Date()).getDate()) + " " + (/* @__PURE__ */ new Date()).toLocaleString("default", { month: "long" }) + " " + (/* @__PURE__ */ new Date()).getFullYear() + ". A short recap",
            publishDate: (/* @__PURE__ */ new Date()).toISOString(),
            updatedDate: (/* @__PURE__ */ new Date()).getDate() + " " + (/* @__PURE__ */ new Date()).toLocaleString("default", { month: "short" }) + " " + (/* @__PURE__ */ new Date()).getFullYear(),
            filename_year: (/* @__PURE__ */ new Date()).getFullYear(),
            filename_month: (/* @__PURE__ */ new Date()).toLocaleString("default", { month: "long" }),
            filename_date: (/* @__PURE__ */ new Date()).toLocaleString("default", { month: "long" }) + "-" + (/* @__PURE__ */ new Date()).getDate() + "-" + (/* @__PURE__ */ new Date()).toLocaleString("default", { year: "2-digit" }),
            filename_name: (/* @__PURE__ */ new Date()).toLocaleString("default", { month: "long" }) + "_" + (/* @__PURE__ */ new Date()).getDate() + "_" + (/* @__PURE__ */ new Date()).toLocaleString("default", { year: "2-digit" }),
            tags: [
              (/* @__PURE__ */ new Date()).toLocaleString("default", { month: "long" }).toLowerCase(),
              String((/* @__PURE__ */ new Date()).getFullYear())
            ],
            body: {}
          };
        },
        ui: {
          filename: {
            readonly: false,
            slugify: (values) => {
              return `${values?.filename_year}/${values?.filename_month}/${values?.filename_date?.replace(/[^a-z^A-Z^0-9]/g, "-") || "no-topic"}/${values?.filename_name}`;
            }
          }
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
            ui: {
              validate: (_value, data) => {
                const lengthOfTitle = data?.title?.length || 0;
                if (lengthOfTitle >= 60) {
                  return "The description must be shorter than 60 characters";
                }
                return "";
              }
            }
          },
          {
            type: "string",
            name: "description",
            label: "Description",
            required: true,
            ui: {
              validate: (_value, data) => {
                const lengthOfDescription = data?.description?.length || 0;
                if (lengthOfDescription <= 50) {
                  return "The description must be longer than 50 characters";
                } else if (lengthOfDescription >= 160) {
                  return "The description must be shorter than 160 characters";
                }
                return "";
              }
            }
          },
          {
            type: "datetime",
            name: "publishDate",
            label: "Publish Date",
            required: true
          },
          {
            type: "string",
            name: "updatedDate",
            label: "Updated Date",
            required: true
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true
          },
          {
            type: "object",
            name: "coverImage",
            label: "Cover Image",
            required: false,
            fields: [
              { label: "Source", name: "src", type: "image" },
              { label: "Alt", name: "alt", type: "string" }
            ]
          },
          {
            type: "boolean",
            name: "draft",
            label: "Draft",
            required: false,
            description: "If this is checked the post will not be published"
          },
          {
            type: "string",
            name: "tags",
            label: "Tags",
            list: true,
            required: false
          }
        ]
      }
    ]
  },
  search: {
    tina: {
      indexerToken: process.env.TINASEARCH || "null",
      stopwordLanguages: ["eng"]
    },
    indexBatchSize: 50,
    maxSearchIndexFieldLength: 100
  }
});
export {
  config_default as default
};
