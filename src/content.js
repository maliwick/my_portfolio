// Each entry belongs to its page folder. All content files in these folders are public.
const entries = import.meta.glob("./pages/{Labs,Badges,Projects,Blogs}/content/*.json", { eager: true, import: "default" });
const folders = { labs: "Labs", badges: "Badges", projects: "Projects", blog: "Blogs" };
export default Object.fromEntries(Object.entries(folders).map(([kind, folder]) => [kind, Object.entries(entries).filter(([path]) => path.includes("/" + folder + "/")).map(([,entry]) => entry)]));
