export function setSize(target, container, type, posY, posX) {
    posY = posY ? posY : 'center';
    posX = posX ? posX : 'center';
    let containerW = container.width || container.w,
    containerH = container.height || container.h,
    targetW = target.width || target.w,
    targetH = target.height || target.h,
    rw = containerW / targetW,
    rh = containerH / targetH,
    r, top, left;
    if (type == 'cover') {
      r = (rw > rh) ? rw : rh;
    } else if (type == 'contain') {
      r = (rw < rh) ? rw : rh;
    }
    top = (containerH - targetH * r) >> 1, left = (containerW - targetW * r) >> 1;
    if (posY == 'top') {
      top = 0
    }
    if (posY == 'bottom') {
      top = containerH - targetH*r
    }
    if (posX == 'left') {
      left = 0
    }
    if (posX == 'right') {
      left = containerW - targetW*r
    }
    return {
      left: left,
      top: top,
      width: targetW * r,
      height: targetH * r,
      scale: r
    };
  }
  