// Configuration Eleventy volontairement minimale.
// Le site reste du HTML : Eleventy ne sert qu'a injecter les donnees du front
// matter dans src/index.njk et a recopier les fichiers statiques tels quels.

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/fonts");

  // Les dates saisies dans CloudCannon arrivent ici en objet Date (ou en texte).
  // On tolere une valeur vide ou invalide pour qu'une carte fraichement ajoutee
  // ne casse jamais le build.
  const versDate = (valeur) => {
    if (!valeur) return null;
    const d = valeur instanceof Date ? valeur : new Date(valeur);
    return Number.isNaN(d.getTime()) ? null : d;
  };

  const formatFr = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  eleventyConfig.addFilter("dateFr", (valeur) => {
    const d = versDate(valeur);
    return d ? formatFr.format(d) : "";
  });

  eleventyConfig.addFilter("dateIso", (valeur) => {
    const d = versDate(valeur);
    return d ? d.toISOString().slice(0, 10) : "";
  });

  return {
    dir: {
      input: "src",
      output: "_site",
    },
  };
};
