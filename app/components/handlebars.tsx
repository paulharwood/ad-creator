import React, { useEffect, useState } from 'react';
import Handlebars from 'handlebars';

const HandlebarsComponent: React.FC = () => {
  const [template, setTemplate] = useState<string | null>(null);
  const [data, setData] = useState<{ [key: string]: any }>({
    label_title: 'label_title',
    keyword_title: 'keyword_title',
    keyword_title_size: 'keyword_title_size',
    suggested_use: 'suggested_use',
    use_by_date: 'use_by_date',
    is_vegetarian: 'is_vegetarian',
    is_vegan: 'is_vegan',
    feature_image_code: 'feature_image_code',
    brand_colour: 'brand_colour',
    units_in_pack: 'units_in_pack',
    current_batch_number: 'current_batch_number',
    ingredients: 'ingredients',
    ingredients_fr: 'ingredients_fr',
    ingredients_de: 'ingredients_de',
    ingredients_es: 'ingredients_es',
    ingredients_it: 'ingredients_it',
    barcode_ean: '9171800032179',
    nrv: 'nrv',
    AD_BULLETS: 'AD_BULLETS',
    KEY_FEATURE_TITLE: 'KEY_FEATURE_TITLE',
    KEY_FEATURE_COPY: 'KEY_FEATURE_COPY',
    BULLETS_ES:'BULLETS_ES',
    TITLE_ES:'TITLE_ES',
    COPY_ES:'COPY_ES',
    BULLETS_DE:'BULLETS_DE',
    TITLE_DE:'TITLE_DE',
    COPY_DE:'COPY_DE',
    BULLETS_IT:'BULLETS_IT',
    TITLE_IT:'TITLE_IT',
    COPY_IT:'COPY_IT',
    BULLETS_FR:'BULLETS_FR',
    TITLE_FR:'TITLE_FR',
    COPY_FR:'COPY_FR',

  });
  
  // Load CSS
   const [ stylePath, setStylePath ] = useState("/templates/rs_front_template.html");
    const handleButtonClick = () => {
        setStylePath({stylePath: 'style2.css'});
    }
      useEffect(() => {
        var head = document.head;
        var link = document.createElement("link");

        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = stylePath;

        head.appendChild(link);

        return () => { head.removeChild(link); }

      }, [stylePath]);

  // Load template
  useEffect(() => {
    // Fetch the Handlebars template file
    fetch('/templates/rs_front_template.html')
      .then(response => response.text())
      .then(templateSource => {
        // Compile the Handlebars template
        const compiledTemplate = Handlebars.compile(templateSource);
        // Apply the data to the template
        const renderedTemplate = compiledTemplate(data);
        setTemplate(renderedTemplate);
      })
      .catch(error => {
        console.error('Error loading Handlebars template:', error);
      });
  }, [data]);

  return (
    <div>
      <button type="button" onClick={handleButtonClick}>
        Click to update stylesheet
      </button>
      {template && <div dangerouslySetInnerHTML={{ __html: template }} />}
    </div>
  );
};

export default HandlebarsComponent;