import fs from 'fs';
import StandardFont from './font/standard';
// import EmbeddedFont from './font/embedded'; // not needed without fontkit

class PDFFontFactory {
  static open(document, src, family, id) {
    if (typeof src === 'string') {
      if (StandardFont.isStandardFont(src)) {
        return new StandardFont(document, src, id);
      }

      throw new Error(
        `Only standard fonts are supported in this build (no custom fonts or fontkit): ${src}`
      );
    }

    // If src is a buffer or ArrayBuffer
    throw new Error(
      'Embedded or custom fonts are disabled in this build. Use standard fonts only.'
    );
  }
}

export default PDFFontFactory;
