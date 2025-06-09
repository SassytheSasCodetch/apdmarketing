
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
    if(!width || !height){
      $('#drawing').empty();
      return;
    }
    var margin = 60;
    var svg = `
      <svg viewBox="0 0 ${width + margin} ${height + margin}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="glassGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="rgba(255,255,255,0.5)" />
            <stop offset="100%" stop-color="rgba(0,150,255,0.25)" />
          </linearGradient>
          <linearGradient id="frameGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#ccc" />
            <stop offset="100%" stop-color="#666" />
          </linearGradient>
          <marker id="arrow" markerWidth="10" markerHeight="10" refX="0" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="#555" />
          </marker>
        </defs>
        <g transform="translate(30,30)">
          <rect x="0" y="0" width="${width}" height="${height}" fill="url(#glassGrad)" stroke="url(#frameGrad)" stroke-width="20" />
        </g>
        <line x1="30" y1="${height + 40}" x2="${width + 30}" y2="${height + 40}" stroke="#555" marker-start="url(#arrow)" marker-end="url(#arrow)" />
        <text x="${width / 2 + 30}" y="${height + 55}" text-anchor="middle" font-size="14" fill="#555">W ${width}mm</text>
        <line x1="20" y1="30" x2="20" y2="${height + 30}" stroke="#555" marker-start="url(#arrow)" marker-end="url(#arrow)" />
        <text x="15" y="${height / 2 + 30}" text-anchor="middle" font-size="14" fill="#555" transform="rotate(-90 15,${height / 2 + 30})">H ${height}mm</text>
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

