class Estimate < ActiveRecord::Base
  has_many :tasks, :attributes => true, :dependent => :nullify
  belongs_to :user
  
  named_scope :descending, :order => 'id DESC'
  
  validates_presence_of :title
  
  def self.paginated(user, page)
    descending.paginate(:all, :conditions => { 
        :user_id => user.id 
      }, :page => page, :per_page => 10)
  end
  
  def total
    tasks.inject(0) do |sum, task|
      sum += task.rate.to_i * task.hours.to_i
    end.to_s
  end
end