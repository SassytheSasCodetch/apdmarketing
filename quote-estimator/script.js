
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
      if(currentStep === 2 || currentStep === 4){
        drawWindow();
      }
      if(currentStep === 4){
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
    return true;
  }

  function calculateQuote(){
    var type = $('#window-type').val();
    var width = parseFloat($('#width').val());
    var height = parseFloat($('#height').val());
    var frame = 'aluminum';
    var glazing = [];
    $('input[name="glazing"]:checked').each(function(){
      glazing.push($(this).val());
    });

    var summary = `Type: ${type}<br>Dimensions: ${width}mm x ${height}mm<br>Frame: ${frame}<br>Glazing: ${glazing.join(', ') || 'None'}`;
    $('#quote-summary').html(summary);
    $('#quote-details').val(JSON.stringify({ type, width, height, frame, glazing }));
  }

  function drawWindow(){
    var width = parseFloat($('#width').val()) || 0;
    var height = parseFloat($('#height').val()) || 0;
    var type = $('#window-type').val();
    if(!width || !height){
      $('#drawing').empty();
      return;
    }
    var margin = 80;
    var glassW = width - 16;
    var glassH = height - 16;
    var svg = `
      <svg viewBox="0 0 ${width + margin} ${height + margin}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="glassGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#b0e0ff" />
            <stop offset="100%" stop-color="#e6f7ff" />
          </linearGradient>
          <marker id="arrow" markerWidth="10" markerHeight="10" refX="0" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="#555" />
          </marker>
        </defs>
        <g transform="translate(40,40)">
          <rect x="0" y="0" width="${width}" height="${height}" fill="none" stroke="#000" stroke-width="4" />
          <rect x="4" y="4" width="${width - 8}" height="${height - 8}" fill="none" stroke="#fff" stroke-width="4" />
          <rect x="8" y="8" width="${glassW}" height="${glassH}" fill="url(#glassGrad)" stroke="#000" stroke-width="4" />
          ${type === 'awning' ? `<line x1="8" y1="8" x2="${glassW/2 + 8}" y2="${glassH + 8}" stroke="#000" stroke-width="2" />
          <line x1="${glassW + 8}" y1="8" x2="${glassW/2 + 8}" y2="${glassH + 8}" stroke="#000" stroke-width="2" />` : ''}
          ${type === 'sliding' ? `<line x1="${glassW/2 + 8}" y1="8" x2="${glassW/2 + 8}" y2="${glassH + 8}" stroke="#000" stroke-width="4" />
          <line x1="${glassW + 6}" y1="${glassH/2 + 8}" x2="${glassW/2 + 12}" y2="${glassH/2 + 8}" stroke="#000" stroke-width="2" marker-end="url(#arrow)" />` : ''}
        </g>
        <line x1="40" y1="${height + 60}" x2="${width + 40}" y2="${height + 60}" stroke="#555" marker-start="url(#arrow)" marker-end="url(#arrow)" />
        <text x="${width / 2 + 40}" y="${height + 75}" text-anchor="middle" font-size="14" fill="#555">W ${width}mm</text>
        <line x1="30" y1="40" x2="30" y2="${height + 40}" stroke="#555" marker-start="url(#arrow)" marker-end="url(#arrow)" />
        <text x="25" y="${height / 2 + 40}" text-anchor="middle" font-size="14" fill="#555" transform="rotate(-90 25,${height / 2 + 40})">H ${height}mm</text>
      </svg>
    `;

    $('#drawing').html(svg);
    $('#drawing svg').hide().fadeIn(300);
  }

  $('#width, #height, #window-type').on('input change', drawWindow);

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

