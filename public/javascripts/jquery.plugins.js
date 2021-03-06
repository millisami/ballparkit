// fancy tooltips
$.fn.tooltip = function(options) {
  var options = $.extend({
    xOffset: 30, 
    yOffset: 7,
    follow: false
  }, options)
  
  return this.each(function() {
    $(this).hover(function(e) {
      
      // prevent duplicate "hovers"
      this._title = this.title
      this.title = ''
      
      $('body').append('<p id="tooltip">' + this._title + '</p>')
      $('#tooltip').
        css('top',  (e.pageY - options.yOffset) + 'px').
        css('left', (e.pageX + options.xOffset) + 'px').
        fadeIn('fast')
    }, function() {
      this.title = this._title
      $('#tooltip').remove()
    })
    
    // supports the option to follow the
    // tooltip wherever the cursor goes
    if (options.follow) {
      $(this).mousemove(function(e) {
        $('#tooltip').
          css('top',  (e.pageY - options.yOffset) + 'px').
          css('left', (e.pageX + options.xOffset) + 'px')
      })
    }
  })
}

// convenience way to check for characters
$.fn.contains = function(character) {
  this.toString().indexOf(character) > -1
}

// zebra stripes for tables
$.fn.zebra = function() {
  $(this).find('tr').removeClass('odd').
    end().find('tr:odd').addClass('odd')
}

// converts regular numbers to US dollar
$.fn.toCurrency = function() {
  var currency = Math.abs($(this).text()).toFixed(2),
      dollars  = currency.split('.')[0],
      cents    = currency.split('.')[1]
      
  for (var i = 0; i < Math.floor((dollars.length - (1 + i)) / 3); i++)
  	dollars = dollars.substring(0, dollars.length - (4 * i + 3)) + ',' + 
  	  dollars.substring(dollars.length - (4 * i + 3))
  
  $(this).text('$' + dollars + '.' + cents)
}

// calculates a task total for a given row
$.fn.writeTaskTotal = function(hours, rate) {
  var hours = Number(hours),
      rate  = Number(rate),
      price = isNaN(hours) || isNaN(rate) ? 0 : hours * rate
      
  $(this).html(price).toCurrency()
}

// estimate namespace
$.extend({
  estimate: {
    // totals the estimate form based on each
    // task total; to force task totals to be
    // reloaded, pass { reload: true }
    total: function(options) {
      var options = $.extend({
        reload: false
      }, options), total = 0
      
      if (options.reload) $.estimate.totalTasks()
      
      $('.tasks .estimate span').each(function() {
        total += Math.abs($(this).text().replace(/\$|\,/g, ''))
      })
      
      if ($('input.discount').val()) total = $.estimate.discount.calculate(total)
      
      $('#total span').text(total).toCurrency()
    },
    // totals a task for a given row
    totalTasks: function() {
      $('input.hours, input.rate').each(function() {
        var hours = $(this).parents('.task').find('input.hours').val(),
            rate  = $(this).parents('.task').find('input.rate').val(),
            span  = $(this).parents('.task').find('.estimate span')
        
        rate = rate ? rate.replace(/\$|\,/g, '') : rate
            
        span.writeTaskTotal(hours, rate)
      })
    },
    // any events related to live estimates
    bindListeners: function() {
      // bind the keyup to the estimate form so totals are live
      $('input.hours, input.rate, input.discount').live('keyup', function() { $.estimate.total({reload: true}) })
    }
  }
})

// handle discounts
$.estimate.discount = {
  handle: function() {
    $('#discount span').hide()
    $('#discount p').show().find('input.discount').focus()
  },
  calculate: function(total) {
    var discount = $('input.discount').val(),
        percentageOff = parseFloat(discount)
    
    return percentageOff == NaN ? total : total - ((percentageOff/100) * total)
  }
}