import type { DocumentDefinition } from "sanity";
import type { StructureResolver } from "sanity/structure";

export function singletonPlugin(types: string[]) {
  return {
    name: "singletonPlugin",
    document: {
      newDocumentOptions: (prev: DocumentDefinition[], { creationContext }: { creationContext: { type: string } }) => {
        if (creationContext.type === "global") {
          return prev.filter(
            (template: DocumentDefinition) => !types.includes(template.templateId ?? "")
          );
        }
        return prev;
      },
      actions: (prev: any[], { schemaType }: { schemaType: string }) => {
        if (types.includes(schemaType)) {
          return prev.filter(({ action }: { action: string }) =>
            ["publish", "discardChanges", "restore"].includes(action)
          );
        }
        return prev;
      },
    },
  };
}

export function singletonStructure(
  types: string[]
): StructureResolver {
  return (S) => {
    const singletonItems = types.map((typeName) =>
      S.listItem()
        .title(typeName === "siteSettings" ? "Site Settings" : "Home Page")
        .id(typeName)
        .child(S.document().schemaType(typeName).documentId(typeName))
    );

    const defaultListItems = S.documentTypeListItems().filter(
      (item) => !types.includes(item.getId()!)
    );

    return S.list()
      .title("Content")
      .items([...singletonItems, S.divider(), ...defaultListItems]);
  };
}
