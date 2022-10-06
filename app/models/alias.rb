# frozen_string_literal: true

class Alias < ApplicationRecord
  belongs_to :aliasable, polymorphic: true

  validates :name, :aliasable_id, :aliasable_type, presence: true
  validates :name, uniqueness: { scope: %i[aliasable_id aliasable_type] }

  before_validation :check_aliasable

  attr_accessor :company_id

  scope :by_company_name, (->(name) do
    joins("INNER JOIN companies ON aliases.aliasable_id = companies.id")
      .where(aliases: { aliasable_type: "Company" })
      .where("LOWER(companies.name) LIKE ?", "%#{name.downcase}%")
  end)

  accepts_nested_attributes_for :aliasable

  ALIASABLE_TYPES = %w[Company].freeze

  def self.csv_export_format(company_ids) # rubocop:disable Metrics/MethodLength
    CSV.generate do |csv|
      csv_fields = %i[id name vendor_name]
      1.upto(Company.max_number_of_aliases) { |i| csv_fields << "incoming_#{i}" }
      csv << csv_fields
      companies = if company_ids
                    Company.user_view.includes(:aliases).where(id: company_ids)
                  else
                    Company.user_view.includes(:aliases).all
                  end
      companies.find_each(batch_size: 300) do |company|
        aliases = company.aliases.pluck(:name)
        csv << [company.id, company.name, company.vendor_name] + aliases
      end
    end
  end

  private

  def check_aliasable
    self.aliasable_id = company_id if aliasable_type == "Company" && company_id
  end
end
