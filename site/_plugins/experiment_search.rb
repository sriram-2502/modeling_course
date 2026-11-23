require "cgi"

module ExperimentSearch
  # Every experiment include supplies its own anchor and accessible title.
  def experiment_entries(html, page_url)
    html.scan(/<section\b[^>]*\bid="([^"]+)"[^>]*\bdata-search-title="([^"]+)"/).map do |id, title|
      { "url" => "#{page_url}##{id}", "title" => CGI.unescapeHTML(title) }
    end
  end
end

Liquid::Template.register_filter(ExperimentSearch)
