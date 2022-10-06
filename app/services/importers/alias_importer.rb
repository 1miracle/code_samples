# frozen_string_literal: true

class Importers::AliasImporter
  extend Importers::Helpers
  TYPE = "Company"

  def self.process_row!(row, line=2, _file_name="")
    company, aliases = parse_row(row)
    aliases.each { |aliaz| create_aliaz(aliaz, company) if company }
    [nil, nil, nil]
  rescue StandardError => e
    line_error(e, line)
  end

  def self.parse_row(row)
    company = Company.find_by(id: row[:id])
    aliases = row.each_with_object([]) do |(key, aliaz), array|
      array << aliaz if key =~ /^incoming_/ && aliaz&.strip.present?
    end
    [company, aliases]
  end

  def self.create_aliaz(aliaz, row)
    params = aliaz_params(aliaz, row)
    Alias.create(params)
  end

  def self.aliaz_params(aliaz, row)
    {
      aliasable_id: row[:id],
      aliasable_type: TYPE,
      name: aliaz
    }
  end
end
