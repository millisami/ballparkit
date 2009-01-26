ActionController::Routing::Routes.draw do |map|
  map.root :controller => 'estimates'
  
  map.resource :session
  map.resources :estimates
  map.resources :settings
  
  map.estimate_by_token '/estimate/:token',
    :controller => 'estimates', :action => 'by_token',
    :requirements => { :token => /([a-zA-Z0-9]{40})/ }
  
  map.with_options :controller => 'sessions' do |path|
    path.login '/login', :action => 'new'
    path.logout '/logout', :action => 'destroy'
  end
  
  map.connect ':controller/:action/:id'
  map.connect ':controller/:action/:id.:format'
end
