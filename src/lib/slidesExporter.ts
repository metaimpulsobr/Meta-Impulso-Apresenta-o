import { Slide } from '../types';
import { SLIDES_DATA, CASE_STUDIES } from '../data/presentationData';
import pptxgen from 'pptxgenjs';

interface ExporterProgressCallback {
  (step: string, percentage: number): void;
}

// Convert HEX color to Google Slides API RGB format (values between 0 and 1)
const hexToRgb = (hex: string) => {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;
  return { red: r, green: g, blue: b };
};

// Colors in hex
const NAVY_COLOR = '#0F172A';
const MAGENTA_COLOR = '#D649FB';
const NEON_BLUE_COLOR = '#6BCFFE';
const WHITE_COLOR = '#FFFFFF';
const LIGHT_GRAY_COLOR = '#94A3B8';

// Create a presentation and return its ID
export async function createGooglePresentation(title: string, accessToken: string): Promise<string> {
  const response = await fetch('https://slides.googleapis.com/v1/presentations', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: title,
    }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData?.error?.message || 'Falha ao criar apresentação no Google Slides.');
  }

  const data = await response.json();
  return data.presentationId;
}

/**
 * High-fidelity function that compiles all 14 slides of the Meta Impulso deck.
 * Since we start with 1 default slide from Google Slides API, we will:
 * 1. Read existing slides (the first one is default).
 * 2. Delete default elements or replace slide 1, or create our slides first and delete the first slide.
 * To make it easy, we will create slide_1 to slide_14, and then delete the very first empty default slide!
 */
export async function exportMetaImpulsoSlides(
  accessToken: string,
  onProgress: ExporterProgressCallback
): Promise<string> {
  try {
    onProgress('Iniciando exportação...', 5);
    const presentationId = await createGooglePresentation('Meta Impulso - Apresentação Comercial Premium', accessToken);
    
    // Retrieve the default presentation to find the first slide's ID
    const getRes = await fetch(`https://slides.googleapis.com/v1/presentations/${presentationId}`, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    const presData = await getRes.json();
    const defaultSlideId = presData.slides?.[0]?.objectId;

    onProgress('Configurando estrutura dos slides...', 15);

    const requests: any[] = [];
    
    // Slide sizes in EMU (English Metric Units) - standard slides are 16:9: width: 9144000, height: 5143500
    // Page coordinate bounds: Width = 720 points, Height = 405 points (standard layout grid)
    
    SLIDES_DATA.forEach((slide) => {
      const slideId = `slide_id_${slide.id}`;
      
      // 1. Create a blank slide
      requests.push({
        createSlide: {
          objectId: slideId,
          insertionIndex: slide.id - 1, // Insertion order
          slideLayoutReference: {
            predefinedLayout: 'BLANK'
          }
        }
      });

      // 2. Set background color to deep Navy #0F172A
      requests.push({
        updatePageProperties: {
          objectId: slideId,
          pageProperties: {
            pageBackgroundFill: {
              solidFill: {
                color: {
                  rgbColor: hexToRgb(NAVY_COLOR)
                }
              }
            }
          },
          fields: 'pageBackgroundFill'
        }
      });

      // Let's create unique object IDs for our shape elements to format them in batch
      const titleShapeId = `title_shape_${slide.id}`;
      const subtitleShapeId = `subtitle_shape_${slide.id}`;
      const lineShapeId = `line_shape_${slide.id}`;
      const actionShapeId = `action_shape_${slide.id}`;

      // Build layouts dynamically based on visual style
      if (slide.visualType === 'cover' || slide.visualType === 'footer') {
        // --- COVER / FOOTER INTERACTIVE LAYOUT ---
        // Title text box (Centered)
        requests.push({
          createShape: {
            objectId: titleShapeId,
            shapeType: 'TEXT_BOX',
            elementProperties: {
              pageId: slideId,
              size: {
                width: { magnitude: 600, unit: 'PT' },
                height: { magnitude: 80, unit: 'PT' }
              },
              transform: {
                scaleX: 1, scaleY: 1,
                translateX: 60, translateY: 100,
                unit: 'PT'
              }
            }
          }
        });

        requests.push({
          insertText: {
            objectId: titleShapeId,
            text: slide.title,
            insertionIndex: 0
          }
        });

        // Style Title - Bold, font Inter, 44pt, Magenta color
        requests.push({
          updateTextStyle: {
            objectId: titleShapeId,
            style: {
              fontFamily: 'Helvetica Neue',
              fontSize: { magnitude: 48, unit: 'PT' },
              bold: true,
              foregroundColor: {
                opaqueColor: {
                  rgbColor: hexToRgb(slide.visualType === 'cover' ? MAGENTA_COLOR : NEON_BLUE_COLOR)
                }
              }
            },
            textRange: { type: 'ALL' },
            fields: 'fontFamily,fontSize,bold,foregroundColor'
          }
        });

        // Center align title
        requests.push({
          updateParagraphStyle: {
            objectId: titleShapeId,
            style: { alignment: 'CENTER' },
            textRange: { type: 'ALL' },
            fields: 'alignment'
          }
        });

        // Subtitle text box
        if (slide.subtitle) {
          requests.push({
            createShape: {
              objectId: subtitleShapeId,
              shapeType: 'TEXT_BOX',
              elementProperties: {
                pageId: slideId,
                size: {
                  width: { magnitude: 550, unit: 'PT' },
                  height: { magnitude: 60, unit: 'PT' }
                },
                transform: {
                  scaleX: 1, scaleY: 1,
                  translateX: 85, translateY: 180,
                  unit: 'PT'
                }
              }
            }
          });

          requests.push({
            insertText: {
              objectId: subtitleShapeId,
              text: slide.subtitle,
              insertionIndex: 0
            }
          });

          requests.push({
            updateTextStyle: {
              objectId: subtitleShapeId,
              style: {
                fontFamily: 'Helvetica Neue',
                fontSize: { magnitude: 16, unit: 'PT' },
                foregroundColor: { opaqueColor: { rgbColor: hexToRgb(WHITE_COLOR) } }
              },
              textRange: { type: 'ALL' },
              fields: 'fontFamily,fontSize,foregroundColor'
            }
          });

          // Center align subtitle
          requests.push({
            updateParagraphStyle: {
              objectId: subtitleShapeId,
              style: { alignment: 'CENTER' },
              textRange: { type: 'ALL' },
              fields: 'alignment'
            }
          });
        }

        // Impact statement line
        if (slide.impactPhrase) {
          requests.push({
            createShape: {
              objectId: actionShapeId,
              shapeType: 'TEXT_BOX',
              elementProperties: {
                pageId: slideId,
                size: {
                  width: { magnitude: 500, unit: 'PT' },
                  height: { magnitude: 50, unit: 'PT' }
                },
                transform: {
                  scaleX: 1, scaleY: 1,
                  translateX: 110, translateY: 260,
                  unit: 'PT'
                }
              }
            }
          });

          requests.push({
            insertText: {
              objectId: actionShapeId,
              text: slide.impactPhrase,
              insertionIndex: 0
            }
          });

          requests.push({
            updateTextStyle: {
              objectId: actionShapeId,
              style: {
                fontFamily: 'Courier New',
                fontSize: { magnitude: 13, unit: 'PT' },
                bold: false,
                foregroundColor: { opaqueColor: { rgbColor: hexToRgb(NEON_BLUE_COLOR) } }
              },
              textRange: { type: 'ALL' },
              fields: 'fontFamily,fontSize,foregroundColor,bold'
            }
          });

          requests.push({
            updateParagraphStyle: {
              objectId: actionShapeId,
              style: { alignment: 'CENTER' },
              textRange: { type: 'ALL' },
              fields: 'alignment'
            }
          });
        }

      } else {
        // --- CONTENT LAYOUT FOR INTERACTIVE DETAILS (Left Title, list / grid items) ---
        // Title left alignment
        requests.push({
          createShape: {
            objectId: titleShapeId,
            shapeType: 'TEXT_BOX',
            elementProperties: {
              pageId: slideId,
              size: {
                width: { magnitude: 600, unit: 'PT' },
                height: { magnitude: 50, unit: 'PT' }
              },
              transform: {
                scaleX: 1, scaleY: 1,
                translateX: 50, translateY: 40,
                unit: 'PT'
              }
            }
          }
        });

        requests.push({
          insertText: {
            objectId: titleShapeId,
            text: slide.title,
            insertionIndex: 0
          }
        });

        requests.push({
          updateTextStyle: {
            objectId: titleShapeId,
            style: {
              fontFamily: 'Helvetica Neue',
              fontSize: { magnitude: 30, unit: 'PT' },
              bold: true,
              foregroundColor: { opaqueColor: { rgbColor: hexToRgb(WHITE_COLOR) } }
            },
            textRange: { type: 'ALL' },
            fields: 'fontFamily,fontSize,bold,foregroundColor'
          }
        });

        // Horizontal elegant colored divider logic
        requests.push({
          createShape: {
            objectId: lineShapeId,
            shapeType: 'RECTANGLE',
            elementProperties: {
              pageId: slideId,
              size: {
                width: { magnitude: 80, unit: 'PT' },
                height: { magnitude: 3, unit: 'PT' }
              },
              transform: {
                scaleX: 1, scaleY: 1,
                translateX: 50, translateY: 95,
                unit: 'PT'
              }
            }
          }
        });

        requests.push({
          updateShapeProperties: {
            objectId: lineShapeId,
            shapeProperties: {
              shapeBackgroundFill: {
                solidFill: { color: { rgbColor: hexToRgb(NEON_BLUE_COLOR) } }
              },
              outline: { propertyState: 'NOT_RENDERED' }
            },
            fields: 'shapeBackgroundFill,outline'
          }
        });

        // Handle generic grid mapping
        if (slide.bullets && slide.bullets.length > 0) {
          const numColumns = slide.bullets.length > 4 ? 2 : 1;
          const itemsPerColumn = Math.ceil(slide.bullets.length / numColumns);

          slide.bullets.forEach((bullet, index) => {
            const col = Math.floor(index / itemsPerColumn);
            const row = index % itemsPerColumn;
            
            const bulletShapeId = `bullet_${slide.id}_${index}`;
            const posX = col === 0 ? 50 : 380;
            const posY = 130 + row * 60;

            requests.push({
              createShape: {
                objectId: bulletShapeId,
                shapeType: 'TEXT_BOX',
                elementProperties: {
                  pageId: slideId,
                  size: {
                    width: { magnitude: numColumns === 1 ? 620 : 310, unit: 'PT' },
                    height: { magnitude: 50, unit: 'PT' }
                  },
                  transform: {
                    scaleX: 1, scaleY: 1,
                    translateX: posX, translateY: posY,
                    unit: 'PT'
                  }
                }
              }
            });

            // Format bullet: Bold title in blue/magenta, grey description
            requests.push({
              insertText: {
                objectId: bulletShapeId,
                text: `• ${bullet.title}: ${bullet.description}`,
                insertionIndex: 0
              }
            });

            // Color the lead bullet text beautifully
            requests.push({
              updateTextStyle: {
                objectId: bulletShapeId,
                style: {
                  fontFamily: 'Helvetica Neue',
                  fontSize: { magnitude: 11, unit: 'PT' },
                  foregroundColor: { opaqueColor: { rgbColor: hexToRgb(LIGHT_GRAY_COLOR) } }
                },
                textRange: { type: 'ALL' },
                fields: 'fontFamily,fontSize,foregroundColor'
              }
            });

            // Highlight the bullet title (first few characters)
            requests.push({
              updateTextStyle: {
                objectId: bulletShapeId,
                style: {
                  bold: true,
                  foregroundColor: { opaqueColor: { rgbColor: hexToRgb(MAGENTA_COLOR) } }
                },
                textRange: {
                  type: 'FIXED_RANGE',
                  startIndex: 0,
                  endIndex: bullet.title.length + 2
                },
                fields: 'bold,foregroundColor'
              }
            });
          });
        } else if (slide.content) {
          // If purely text paragraphs (about or general text slides)
          const contentShapeId = `content_${slide.id}`;
          requests.push({
            createShape: {
              objectId: contentShapeId,
              shapeType: 'TEXT_BOX',
              elementProperties: {
                pageId: slideId,
                size: {
                  width: { magnitude: 620, unit: 'PT' },
                  height: { magnitude: 200, unit: 'PT' }
                },
                transform: {
                  scaleX: 1, scaleY: 1,
                  translateX: 50, translateY: 140,
                  unit: 'PT'
                }
              }
            }
          });

          const fullJoinedText = slide.content.join('\n\n');
          requests.push({
            insertText: {
              objectId: contentShapeId,
              text: fullJoinedText,
              insertionIndex: 0
            }
          });

          requests.push({
            updateTextStyle: {
              objectId: contentShapeId,
              style: {
                fontFamily: 'Helvetica Neue',
                fontSize: { magnitude: 14, unit: 'PT' },
                foregroundColor: { opaqueColor: { rgbColor: hexToRgb(WHITE_COLOR) } }
              },
              textRange: { type: 'ALL' },
              fields: 'fontFamily,fontSize,foregroundColor'
            }
          });
        }

        // Custom CTA Slide additions
        if (slide.visualType === 'cta' && slide.ctaText) {
          const btnShapeId = `btn_cta_${slide.id}`;
          requests.push({
            createShape: {
              objectId: btnShapeId,
              shapeType: 'ROUNDED_RECTANGLE',
              elementProperties: {
                pageId: slideId,
                size: {
                  width: { magnitude: 250, unit: 'PT' },
                  height: { magnitude: 40, unit: 'PT' }
                },
                transform: {
                  scaleX: 1, scaleY: 1,
                  translateX: 50, translateY: 300,
                  unit: 'PT'
                }
              }
            }
          });

          requests.push({
            updateShapeProperties: {
              objectId: btnShapeId,
              shapeProperties: {
                shapeBackgroundFill: {
                  solidFill: { color: { rgbColor: hexToRgb(MAGENTA_COLOR) } }
                },
                outline: { propertyState: 'NOT_RENDERED' }
              },
              fields: 'shapeBackgroundFill,outline'
            }
          });

          requests.push({
            insertText: {
              objectId: btnShapeId,
              text: slide.ctaText,
              insertionIndex: 0
            }
          });

          requests.push({
            updateTextStyle: {
              objectId: btnShapeId,
              style: {
                fontFamily: 'Helvetica Neue',
                fontSize: { magnitude: 11, unit: 'PT' },
                bold: true,
                foregroundColor: { opaqueColor: { rgbColor: hexToRgb(WHITE_COLOR) } }
              },
              textRange: { type: 'ALL' },
              fields: 'fontFamily,fontSize,bold,foregroundColor'
            }
          });

          requests.push({
            updateParagraphStyle: {
              objectId: btnShapeId,
              style: { alignment: 'CENTER' },
              textRange: { type: 'ALL' },
              fields: 'alignment'
            }
          });
        }

        // Custom Special Case mappings: Expose Voogle and CRM Case slide details under slide id 12!
        if (slide.visualType === 'cases') {
          // Render brief of Case studies as grid elements directly in Google Slide
          CASE_STUDIES.forEach((cs, csIdx) => {
            const cardShapeId = `case_card_${slide.id}_${cs.id}`;
            const cardPosX = csIdx < 2 ? 50 + csIdx * 310 : 50 + (csIdx - 2) * 310;
            const cardPosY = csIdx < 2 ? 120 : 250;

            requests.push({
              createShape: {
                objectId: cardShapeId,
                shapeType: 'ROUNDED_RECTANGLE',
                elementProperties: {
                  pageId: slideId,
                  size: {
                    width: { magnitude: 290, unit: 'PT' },
                    height: { magnitude: 110, unit: 'PT' }
                  },
                  transform: {
                    scaleX: 1, scaleY: 1,
                    translateX: cardPosX, translateY: cardPosY,
                    unit: 'PT'
                  }
                }
              }
            });

            requests.push({
              updateShapeProperties: {
                objectId: cardShapeId,
                shapeProperties: {
                  shapeBackgroundFill: {
                    solidFill: { color: { rgbColor: hexToRgb('#1E293B') } } // Slate-800
                  },
                  outline: {
                    solidFill: { color: { rgbColor: hexToRgb('#334155') } },
                    weight: { magnitude: 1, unit: 'PT' }
                  }
                },
                fields: 'shapeBackgroundFill,outline'
              }
            });

            // Text inside card
            const textContent = `${cs.name} (${cs.category})\nMetrics: ${cs.metrics.map(m => `${m.label}: ${m.value}`).join(' | ')}\n${cs.description.substring(0, 70)}...`;
            requests.push({
              insertText: {
                objectId: cardShapeId,
                text: textContent,
                insertionIndex: 0
              }
            });

            requests.push({
              updateTextStyle: {
                objectId: cardShapeId,
                style: {
                  fontFamily: 'Helvetica Neue',
                  fontSize: { magnitude: 9, unit: 'PT' },
                  foregroundColor: { opaqueColor: { rgbColor: hexToRgb(WHITE_COLOR) } }
                },
                textRange: { type: 'ALL' },
                fields: 'fontFamily,fontSize,foregroundColor'
              }
            });

            // Highlight company name
            requests.push({
              updateTextStyle: {
                objectId: cardShapeId,
                style: {
                  bold: true,
                  fontSize: { magnitude: 12, unit: 'PT' },
                  foregroundColor: { opaqueColor: { rgbColor: hexToRgb(NEON_BLUE_COLOR) } }
                },
                textRange: {
                  type: 'FIXED_RANGE',
                  startIndex: 0,
                  endIndex: cs.name.length
                },
                fields: 'bold,fontSize,foregroundColor'
              }
            });
          });
        }
      }
    });

    onProgress('Vinculando elementos e estilos...', 55);

    // 3. Delete the default first blank slide Google automatically provisions
    if (defaultSlideId) {
      requests.push({
        deleteObject: {
          objectId: defaultSlideId
        }
      });
    }

    onProgress('Gerando arquivo no Google Drive...', 75);

    // Let's execute the batch update request
    const batchUpdateRes = await fetch(`https://slides.googleapis.com/v1/presentations/${presentationId}:batchUpdate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: requests
      })
    });

    if (!batchUpdateRes.ok) {
      const errDetail = await batchUpdateRes.json().catch(() => ({}));
      console.error('Google batchUpdate failed:', errDetail);
      throw new Error(errDetail?.error?.message || 'Erro ao sincronizar formatação de slides.');
    }

    onProgress('Finalizando exportação!', 100);
    return presentationId;

  } catch (error: any) {
    console.error('Exporting error:', error);
    throw error;
  }
}

/**
 * High-fidelity local exporter that creates a fully styled Microsoft PowerPoint (.pptx)
 * document natively on the client using pptxgenjs, matching the design aesthetic of the deck.
 */
export async function downloadMetaImpulsoPptx(
  onProgress: (step: string, percentage: number) => void
): Promise<void> {
  try {
    onProgress('Gerando arquivo PowerPoint...', 10);
    const pptx = new pptxgen();
    pptx.layout = 'LAYOUT_16x9';

    onProgress('Modelando slides corporativos...', 30);

    SLIDES_DATA.forEach((slide, idx) => {
      const pptxSlide = pptx.addSlide();
      
      // Set solid background color matching modern navy theme
      pptxSlide.background = { fill: '0F172A' };

      // Add elegant watermark / page identifier in small uppercase letters
      pptxSlide.addText('META IMPULSO • APRESENTAÇÃO COMERCIAL v1.2', {
        x: 0.8,
        y: 0.2,
        w: 6.0,
        h: 0.3,
        fontSize: 8,
        color: '94A3B8',
        fontFace: 'Arial',
        bold: false
      });
      
      // Add page counter indicator
      pptxSlide.addText(`SLIDE ${idx + 1} DE ${SLIDES_DATA.length}`, {
        x: 7.5,
        y: 0.2,
        w: 1.7,
        h: 0.3,
        fontSize: 8,
        color: '6BCFFE',
        fontFace: 'Arial',
        align: 'right',
        bold: true
      });

      if (slide.visualType === 'cover' || slide.visualType === 'footer') {
        // --- COVER OR FOOTER INTERACTIVE DESIGN ---
        // Decorative background orbit visual accents
        pptxSlide.addShape(pptx.ShapeType.ellipse, { 
          x: 6.2, y: 1.0, w: 3.5, h: 3.5, 
          line: { color: '334155', width: 2 } 
        });
        pptxSlide.addShape(pptx.ShapeType.ellipse, { 
          x: 6.7, y: 1.5, w: 2.5, h: 2.5, 
          line: { color: '475569', width: 1.5 } 
        });
        
        // Add a filled accent node
        pptxSlide.addShape(pptx.ShapeType.ellipse, {
          x: 7.8, y: 2.6, w: 0.3, h: 0.3,
          fill: { color: '6BCFFE' }
        });

        // Massive Display Title (Widescreen Center-Left)
        pptxSlide.addText(slide.title, {
          x: 0.8,
          y: 1.3,
          w: 5.5,
          h: 1.2,
          fontSize: 44,
          bold: true,
          color: slide.visualType === 'cover' ? 'D649FB' : '6BCFFE',
          fontFace: 'Helvetica'
        });

        // Elegant thick decorative line
        pptxSlide.addShape(pptx.ShapeType.rect, { 
          x: 0.8, y: 2.6, w: 1.5, h: 0.05, 
          fill: { color: '6BCFFE' } 
        });

        // Subtitle text block below line
        pptxSlide.addText(slide.subtitle || '', {
          x: 0.8,
          y: 2.8,
          w: 5.5,
          h: 0.8,
          fontSize: 16,
          color: 'FFFFFF',
          fontFace: 'Helvetica'
        });

        // Dynamic impact statement
        if (slide.impactPhrase) {
          pptxSlide.addText(`"${slide.impactPhrase}"`, {
            x: 0.8,
            y: 3.8,
            w: 8.4,
            h: 0.8,
            fontSize: 12,
            italic: true,
            color: '6BCFFE',
            fontFace: 'Courier New'
          });
        }

      } else {
        // --- MULTI-COLUMN CONTENT AND LIST SLIDES LAYOUT ---
        // Header Category title in uppercase letterspacing
        const categoryTag = slide.visualType === 'about' ? 'CONHEÇA A AGÊNCIA' : 
                            slide.visualType === 'problem' ? 'GARGALOS DO MERCADO' : 
                            slide.visualType === 'solution' ? 'SOLUÇÃO COMPLETA' :
                            slide.visualType === 'crm' ? 'CONVERSÃO & CRM' :
                            slide.visualType === 'ia' ? 'DEEP TECH / IA' :
                            slide.visualType === 'cases' ? 'RESULTADOS PRÁTICOS' : 'PRODUTOS DE ELITE';
                            
        pptxSlide.addText(categoryTag, {
          x: 0.8,
          y: 0.5,
          w: 4.0,
          h: 0.3,
          fontSize: 9,
          color: 'D649FB',
          bold: true,
          fontFace: 'Arial'
        });

        // Slides Main Title
        pptxSlide.addText(slide.title, {
          x: 0.8,
          y: 0.8,
          w: 8.4,
          h: 0.5,
          fontSize: 24,
          bold: true,
          color: 'FFFFFF',
          fontFace: 'Helvetica'
        });

        // Subtitle line
        pptxSlide.addText(slide.subtitle || '', {
          x: 0.8,
          y: 1.3,
          w: 8.4,
          h: 0.3,
          fontSize: 12,
          color: '6BCFFE',
          fontFace: 'Arial'
        });

        // Small divider line
        pptxSlide.addShape(pptx.ShapeType.rect, { 
          x: 0.8, y: 1.6, w: 1.0, h: 0.03, 
          fill: { color: '6BCFFE' } 
        });

        // Process distinct layouts
        if (slide.visualType === 'cases') {
          // --- CASE STUDIES GRID LAYOUT (4 Cases) ---
          CASE_STUDIES.forEach((cs, csIdx) => {
            const col = csIdx % 2;
            const row = Math.floor(csIdx / 2);
            
            const cardX = col === 0 ? 0.8 : 5.1;
            const cardY = 1.9 + (row * 1.6);
            
            // Draw card background
            pptxSlide.addShape(pptx.ShapeType.roundRect, {
              x: cardX, y: cardY, w: 4.1, h: 1.4,
              fill: { color: '1E293B' },
              line: { color: '334155', width: 1.5 }
            });

            // Write metrics & details inside card
            pptxSlide.addText(
              [
                { text: `${cs.name} • ${cs.category}\n`, options: { bold: true, fontSize: 12, color: '6BCFFE' } },
                { text: `${cs.metrics.map(m => `${m.label}: ${m.value}`).join(' | ')}\n`, options: { bold: true, fontSize: 10, color: 'D649FB' } },
                { text: cs.description.substring(0, 75) + "...", options: { fontSize: 9, color: '94A3B8' } }
              ],
              { x: cardX + 0.15, y: cardY + 0.1, w: 3.8, h: 1.2 }
            );
          });

        } else if (slide.visualType === 'cta') {
          // --- CTA SLIDE BIG FOCUS ---
          if (slide.impactPhrase) {
            pptxSlide.addText(`"${slide.impactPhrase}"`, {
              x: 0.8,
              y: 2.0,
              w: 8.4,
              h: 1.0,
              fontSize: 14,
              italic: true,
              color: 'FFFFFF',
              fontFace: 'Arial',
              lineSpacing: 1.3
            });
          }

          // Render active button card mockup
          pptxSlide.addShape(pptx.ShapeType.roundRect, {
            x: 2.2, y: 3.4, w: 5.6, h: 0.7,
            fill: { color: 'D649FB' }
          });

          pptxSlide.addText(slide.ctaText || 'AGENDAR MEU DIAGNÓSTICO ESTRATÉGICO', {
            x: 2.2, y: 3.4, w: 5.6, h: 0.7,
            align: 'center',
            valign: 'middle',
            bold: true,
            fontSize: 12,
            color: 'FFFFFF',
            fontFace: 'Arial'
          });

        } else if (slide.bullets && slide.bullets.length > 0) {
          // Check if there is benefits panel as well, to split screen
          const hasBenefits = slide.benefits && slide.benefits.length > 0;
          
          if (hasBenefits) {
            // --- SPLIT LAYOUT (Left Side Bullets, Right Side Benefits Card) ---
            // Left list of bullets
            slide.bullets.forEach((bullet, bIdx) => {
              const yPos = 1.9 + (bIdx * 0.8);
              pptxSlide.addText(
                [
                  { text: `• ${bullet.title}\n`, options: { bold: true, fontSize: 12, color: '6BCFFE' } },
                  { text: bullet.description, options: { fontSize: 10, color: '94A3B8' } }
                ],
                { x: 0.8, y: yPos, w: 4.2, h: 0.7 }
              );
            });

            // Right side benefits card panel
            pptxSlide.addShape(pptx.ShapeType.roundRect, {
              x: 5.3, y: 1.9, w: 3.9, h: 3.2,
              fill: { color: '1E293B' },
              line: { color: '334155', width: 2 }
            });

            // Header for benefits card
            pptxSlide.addText('BENEFÍCIOS E ENTREGAS', {
              x: 5.5, y: 2.1, w: 3.5, h: 0.3,
              fontSize: 11,
              bold: true,
              color: 'D649FB',
              fontFace: 'Arial'
            });

            // List benefits
            if (slide.benefits) {
              const benefitLines = slide.benefits.map(b => `✔ ${b}`).join('\n\n');
              pptxSlide.addText(benefitLines, {
                x: 5.5,
                y: 2.5,
                w: 3.5,
                h: 2.4,
                fontSize: 10,
                color: 'FFFFFF',
                fontFace: 'Arial',
                lineSpacing: 1.1
              });
            }

          } else {
            // --- STANDARD DOCK BULLETS (Vertical Grid / 2 Col Grid) ---
            const numCols = slide.bullets.length > 4 ? 2 : 1;
            const itemsPerCol = Math.ceil(slide.bullets.length / numCols);
            
            slide.bullets.forEach((bullet, bIdx) => {
              const col = Math.floor(bIdx / itemsPerCol);
              const row = bIdx % itemsPerCol;
              
              const xPos = col === 0 ? 0.8 : 5.1;
              const yPos = 1.9 + (row * 0.8);
              const wVal = numCols === 1 ? 8.4 : 4.1;

              pptxSlide.addText(
                [
                  { text: `• ${bullet.title}\n`, options: { bold: true, fontSize: 12, color: '6BCFFE' } },
                  { text: bullet.description, options: { fontSize: 10, color: '94A3B8' } }
                ],
                { x: xPos, y: yPos, w: wVal, h: 0.7 }
              );
            });
          }
        }
      }
    });

    onProgress('Compactando apresentação PowerPoint...', 85);
    
    // Trigger localized browser prompt to save files natively
    pptx.writeFile({ fileName: 'Meta_Impulso_Apresentacao_Premium.pptx' });
    
    onProgress('Exportado com sucesso!', 100);
  } catch (err) {
    console.error('PowerPoint production failure:', err);
    throw err;
  }
}
