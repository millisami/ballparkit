// fades flash messages
var hideFlashes = function() {
  $('p.notice, p.warning, p.error').fadeOut(1500)
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
      cents    = currency.split('.')[1],
      dollar_length = dollars.length
      
  if (dollar_length > 3) {
    dollars = dollars.substr(0, dollar_length % 3) + ',' + dollars.substr(dollar_length % 3, dollar_length)
  }
  
  currency = dollars + '.' + cents
  
  $(this).text('$' + currency)
}

// calculates a task total for a given row
$.fn.writeTaskTotal = function(hours, rate) {
  $(this).html(hours * rate).toCurrency()
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

      $('#total span').text(total).toCurrency()
    },
    // totals a task for a given row
    totalTasks: function() {
      $('input.hours, input.rate').each(function() {
        var hours = $(this).parents('.task').find('input.hours').val(),
            rate  = $(this).parents('.task').find('input.rate').val().replace(/\$|\,/g, '')
            span  = $(this).parents('.task').find('.estimate span')

        span.writeTaskTotal(hours, rate)
      })
    }
  }
})

// when the DOM loads...
$(document).ready(function() {
  setTimeout(hideFlashes, 25000)
  
  $(':input:visible:enabled:first').focus()
  
  // activate facebox links
  $('a[rel*=facebox]').facebox()
  
  // activate form resetting
  $('form a[rel*=reset]').click(function() {
    $(this).parents('form')[0].reset()
    return false
  })
  
  // fill in default rate in appropriate fields
  $('form a.rate').click(function() {
    $('input.rate').val($(this).text().replace(/\$|\,/g, ''))
    $.estimate.total({reload: true})
    return false
  })
  
  // total the estimate form
  $.estimate.totalTasks()
  $.estimate.total()
  
  // bind the keyup to the estimate form so totals are live
  $('input.hours, input.rate').bind('keyup', function() { $.estimate.total({reload: true}) })
  
  // show options on hover
  $('ul.estimates li').mouseover(function() {
    $(this).addClass('highlight').find('span.options').show()
  }).mouseout(function() {
    $(this).removeClass('highlight').find('span.options').hide()
  })
});