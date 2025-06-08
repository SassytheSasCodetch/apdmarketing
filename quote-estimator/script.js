$(document).ready(function(){
  var currentStep = 1;
  showStep(currentStep);

  function showStep(step){
    $('.step').removeClass('active');
    $('#step-' + step).addClass('active');
  }

  $('.next').on('click', function(){
    if(validateStep(currentStep)){
      currentStep++;
      showStep(currentStep);
      if(currentStep === 2){
        drawWindow();
      }
      if(currentStep === 5){
        calculateQuote();
      }
    }
  });

  $('.prev').on('click', function(){
    currentStep--;
    showStep(currentStep);
  });

  $('#quote-form').on('submit', function(e){
    e.preventDefault();
    alert('Form submitted!');
  });

  function validateStep(step){
    if(step === 1){
      return $('#window-type').val();
    }
    if(step === 2){
      return $('#width').val() && $('#height').val();
    }
    if(step === 3){
      return $('input[name="frame"]:checked').length > 0;
    }
    return true;
  }

  function calculateQuote(){
    var type = $('#window-type').val();
    var width = parseFloat($('#width').val());
    var height = parseFloat($('#height').val());
    var area = width * height;
    var frame = $('input[name="frame"]:checked').val();
    var glazing = [];
    $('input[name="glazing"]:checked').each(function(){
      glazing.push($(this).val());
    });

    var price = area * 0.02; // base price per sq mm
    if(frame === 'wood') price *= 1.2;
    if(frame === 'pvc') price *= 1.1;
    if(glazing.indexOf('double') !== -1) price += area * 0.01;
    if(glazing.indexOf('tinted') !== -1) price += area * 0.005;
    if(glazing.indexOf('low-e') !== -1) price += area * 0.008;

    var summary = `Type: ${type}<br>Dimensions: ${width}mm x ${height}mm<br>Frame: ${frame}<br>Glazing: ${glazing.join(', ') || 'None'}<br><strong>Estimated Price: $${price.toFixed(2)}</strong>`;
    $('#quote-summary').html(summary);
    $('#quote-details').val($(this).text());
    var data = {
      type: type,
      width: width,
      height: height,
      frame: frame,
      glazing: glazing,
      price: price.toFixed(2)
    };
    $('#quote-details').val(JSON.stringify(data));
  }

  function drawWindow(){
    var width = parseFloat($('#width').val()) || 0;
    var height = parseFloat($('#height').val()) || 0;
    var svg = `<svg viewBox="0 0 ${width} ${height}"><rect x="0" y="0" width="${width}" height="${height}" fill="rgba(0,150,255,0.1)" stroke="#0096ff"/><text x="${width/2}" y="${height/2}" dominant-baseline="middle" text-anchor="middle" font-size="20" fill="#333">${width} x ${height}</text></svg>`;
    $('#drawing').html(svg);
  }

  $('#width, #height').on('input', drawWindow);
});
