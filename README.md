# Website for Argumentation Mining Corpora
This repository contains the source code and data for a static website containing a detailed list of corpora for argumentation mining and their associated papers. If you wish to view the website click [here](TODOlinktopageshost). This site serves as an accompaniment to the 2nd edition of [Argumentation Mining](TODOlinktobook). If you wish to cite this site or it's content please cite the book:
```
@book{argumentationMining2ndEd,
  TODO
}

```
# Updating the Site
This website will be a maintained resource, and encourages contributions from the community. Data from the site can be downloaded in an excel format from the deployed [page](TODOlinktopageshost), or the full JSON for the [papers](src/data/entries/papers.json) and [corpora](src/data/entries/corpora.json) can be downloaded. The site is intended to document corpora, therefore we will not add new papers to the site unless they introduce or annotate corpora, and we will not add any corpora to the site that do not come from an associated paper. If you wish to add a new corpora/paper to the site one of two options are available, detailed below.

## Submitting an Issue
You can request a new paper/corpora be added to the site by raising an issue. Please title your issues: "[Missing Corpora] _Name of Paper_". Please provide as much detail as possible about the corpora (why it is suitable for the site) as well as a link to the paper that introduces it. We will then make the neccessary updates to the JSON files to include it.

## Submitting a Pull Request
Alternatively, you can manually add the data to the JSON yourself. You will need to add the relevant data to both [src/data/entries/papers.json](src/data/entries/papers.json) and [src/data/entries/corpora.json](src/data/entries/corpora.json), while following the schema descriptions in [src/data/schema/papers.json](src/data/entries/papers.json) and [src/data/schema/corpora.json](src/data/entries/corpora.json). To test if everything is functioning correctly, get the requirements using `npm install`, then navigate to source and run `npx tsx schema_validation.ts`. If you encounter no issues then run `npm run dev` to view the site and see if the data is correctly presented. We will reject any new corpoa pull requests that either fail schema validation or try to modify the schemas (see below).

## Submitting Other Issues/Pull Requests
We are open to the raising of other issues and pull requests that address fixes and suggestions (such as updates to schemas). However please keep these requests separate from requests that intrpduce missing corpora/papers. Note, that if you modify a schema you will need to re-reun `npx tsx interface_generation.ts` to ensure new type definitions are generated.
