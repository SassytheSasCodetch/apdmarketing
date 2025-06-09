
$(document).ready(function(){
  var currentStep = 1;
  showStep(currentStep);

  function showStep(step){
    $('.step').removeClass('active');
    $('#step-' + step).addClass('active');
    $('#progressbar li').removeClass('active');
    $('#progressbar li').slice(0, step).addClass('active');
  }

  $('.next').on('click', function(){
    if(validateStep(currentStep)){
      currentStep++;
      showStep(currentStep);
      if(currentStep === 2 || currentStep === 5){
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

    var summary = \`Type: \${type}<br>Dimensions: \${width}mm x \${height}mm<br>Frame: \${frame}<br>Glazing: \${glazing.join(', ') || 'None'}\`;
    $('#quote-summary').html(summary);
    $('#quote-details').val(JSON.stringify({ type, width, height, frame, glazing }));
  }

  function drawWindow(){
    var width = parseFloat($('#width').val()) || 0;
    var height = parseFloat($('#height').val()) || 0;
    if(!width || !height){
      $('#drawing').empty();
      return;
    }
    var svg = \`
      <svg viewBox="0 0 \${width} \${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="glassGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="rgba(255,255,255,0.5)"/>
            <stop offset="100%" stop-color="rgba(0,150,255,0.25)"/>
          </linearGradient>
          <linearGradient id="frameGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#ccc"/>
            <stop offset="100%" stop-color="#666"/>
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="\${width}" height="\${height}" fill="url(#glassGrad)" stroke="url(#frameGrad)" stroke-width="20"/>
        <text x="\${width/2}" y="\${height/2}" dominant-baseline="middle" text-anchor="middle" font-size="24" fill="#333">\${width} x \${height}</text>
        <text x="\${width/2}" y="20" text-anchor="middle" class="label-x">\${width}mm</text>
        <text x="20" y="\${height/2}" text-anchor="middle" class="label-y">\${height}mm</text>
      </svg>
    \`;

    $('#drawing').html(svg);
    $('#drawing svg').hide().fadeIn(300);
  }

  $('#width, #height').on('input', drawWindow);

  $('#download-svg').on('click', function() {
    const svg = $('#drawing').html();
    const blob = new Blob([svg], {type: 'image/svg+xml'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'window-quote.svg';
    a.click();
    URL.revokeObjectURL(url);
  });
});

