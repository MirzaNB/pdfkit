import AFMFont from './afm';
import PDFFont from '../font';

function getAFMPath(filename) {
  return fs.readFileSync(path.join(__dirname, 'data', filename), 'utf8');
}

const STANDARD_FONTS = {
  Courier() {
    return getAFMPath('Courier.afm');
  },
  'Courier-Bold'() {
    return getAFMPath('Courier-Bold.afm');
  },
  'Courier-Oblique'() {
    return getAFMPath('Courier-Oblique.afm');
  },
  'Courier-BoldOblique'() {
    return getAFMPath('Courier-BoldOblique.afm');
  },
  Helvetica() {
    return getAFMPath('Helvetica.afm');
  },
  'Helvetica-Bold'() {
    return getAFMPath('Helvetica-Bold.afm');
  },
  'Helvetica-Oblique'() {
    return getAFMPath('Helvetica-Oblique.afm');
  },
  'Helvetica-BoldOblique'() {
    return getAFMPath('Helvetica-BoldOblique.afm');
  },
  'Times-Roman'() {
    return getAFMPath('Times-Roman.afm');
  },
  'Times-Bold'() {
    return getAFMPath('Times-Bold.afm');
  },
  'Times-Italic'() {
    return getAFMPath('Times-Italic.afm');
  },
  'Times-BoldItalic'() {
    return getAFMPath('Times-BoldItalic.afm');
  },
  Symbol() {
    return getAFMPath('Symbol.afm');
  },
  ZapfDingbats() {
    return getAFMPath('ZapfDingbats.afm');
  },
};


class StandardFont extends PDFFont {
  constructor(document, name, id) {
    super();
    this.document = document;
    this.name = name;
    this.id = id;
    this.font = new AFMFont(STANDARD_FONTS[this.name]());
    ({
      ascender: this.ascender,
      descender: this.descender,
      bbox: this.bbox,
      lineGap: this.lineGap,
      xHeight: this.xHeight,
      capHeight: this.capHeight,
    } = this.font);
  }

  embed() {
    this.dictionary.data = {
      Type: 'Font',
      BaseFont: this.name,
      Subtype: 'Type1',
      Encoding: 'WinAnsiEncoding',
    };

    return this.dictionary.end();
  }

  encode(text) {
    const encoded = this.font.encodeText(text);
    const glyphs = this.font.glyphsForString(`${text}`);
    const advances = this.font.advancesForGlyphs(glyphs);
    const positions = [];
    for (let i = 0; i < glyphs.length; i++) {
      const glyph = glyphs[i];
      positions.push({
        xAdvance: advances[i],
        yAdvance: 0,
        xOffset: 0,
        yOffset: 0,
        advanceWidth: this.font.widthOfGlyph(glyph),
      });
    }

    return [encoded, positions];
  }

  widthOfString(string, size) {
    const glyphs = this.font.glyphsForString(`${string}`);
    const advances = this.font.advancesForGlyphs(glyphs);

    let width = 0;
    for (let advance of advances) {
      width += advance;
    }

    const scale = size / 1000;
    return width * scale;
  }

  static isStandardFont(name) {
    return name in STANDARD_FONTS;
  }
}

export default StandardFont;
