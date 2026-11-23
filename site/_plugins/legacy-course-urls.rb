class LegacyCourseUrls < Jekyll::Generator
  priority :low

  def generate(site)
    pages = site.pages.select { |page| page.data["section"] || page.url == "/search/" }
    lessons = site.collections.fetch("lectures").docs
    projects = site.collections.fetch("projects").docs

    (pages + lessons + projects).each do |page|
      paths = ["/fall-2026#{page.url}"]
      if (old_url = page.data["legacy_lecture"])
        paths.concat([old_url, "/fall-2026#{old_url}"])
      end
      paths.each do |legacy_path|
        directory = legacy_path.delete_prefix("/")
        redirect = Jekyll::PageWithoutAFile.new(site, site.source, directory, "index.html")
        redirect.data.merge!(
          "layout" => "legacy-redirect",
          "permalink" => legacy_path,
          "destination" => page.url
        )
        site.pages << redirect
      end
    end
  end
end
