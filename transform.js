// transform.js

class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		}
	}

class Transform {
	constructor() {
		// identity matrix
		this.matrix = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
	}

	apply(trans) {
		var result = new Transform();
		result.matrix[0][0] = trans.matrix[0][0] * this.matrix[0][0] + trans.matrix[0][1] * this.matrix[1][0] + trans.matrix[0][2] * this.matrix[2][0];
		result.matrix[0][1] = trans.matrix[0][0] * this.matrix[0][1] + trans.matrix[0][1] * this.matrix[1][1] + trans.matrix[0][2] * this.matrix[2][1];
		result.matrix[0][2] = trans.matrix[0][0] * this.matrix[0][2] + trans.matrix[0][1] * this.matrix[1][2] + trans.matrix[0][2] * this.matrix[2][2];
		result.matrix[1][0] = trans.matrix[1][0] * this.matrix[0][0] + trans.matrix[1][1] * this.matrix[1][0] + trans.matrix[1][2] * this.matrix[2][0];
		result.matrix[1][1] = trans.matrix[1][0] * this.matrix[0][1] + trans.matrix[1][1] * this.matrix[1][1] + trans.matrix[1][2] * this.matrix[2][1];
		result.matrix[1][2] = trans.matrix[1][0] * this.matrix[0][2] + trans.matrix[1][1] * this.matrix[1][2] + trans.matrix[1][2] * this.matrix[2][2];
		result.matrix[2][0] = trans.matrix[2][0] * this.matrix[0][0] + trans.matrix[2][1] * this.matrix[1][0] + trans.matrix[2][2] * this.matrix[2][0];
		result.matrix[2][1] = trans.matrix[2][0] * this.matrix[0][1] + trans.matrix[2][1] * this.matrix[1][1] + trans.matrix[2][2] * this.matrix[2][1];
		result.matrix[2][2] = trans.matrix[2][0] * this.matrix[0][2] + trans.matrix[2][1] * this.matrix[1][2] + trans.matrix[2][2] * this.matrix[2][2];
		this.matrix = result.matrix;
		}
	
	transformPoint(p) {
		return new Point(
			p.x * this.matrix[0][0] + p.y * this.matrix[0][1] + this.matrix[0][2],
			p.x * this.matrix[1][0] + p.y * this.matrix[1][1] + this.matrix[1][2]);
		}

	inverse() {
	    var det = this.matrix[0][0] * (this.matrix[1][1] * this.matrix[2][2] - this.matrix[2][1] * this.matrix[1][2]) -
             this.matrix[0][1] * (this.matrix[1][0] * this.matrix[2][2] - this.matrix[1][2] * this.matrix[2][0]) +
             this.matrix[0][2] * (this.matrix[1][0] * this.matrix[2][1] - this.matrix[1][1] * this.matrix[2][0]);
        var invdet = 1 / det;
		var result = new Transform();
        result.matrix[0][0] = (this.matrix[1][1] * this.matrix[2][2] - this.matrix[2][1] * this.matrix[1][2]) * invdet;
        result.matrix[0][1] = (this.matrix[0][2] * this.matrix[2][1] - this.matrix[0][1] * this.matrix[2][2]) * invdet;
        result.matrix[0][2] = (this.matrix[0][1] * this.matrix[1][2] - this.matrix[0][2] * this.matrix[1][1]) * invdet;
        result.matrix[1][0] = (this.matrix[1][2] * this.matrix[2][0] - this.matrix[1][0] * this.matrix[2][2]) * invdet;
        result.matrix[1][1] = (this.matrix[0][0] * this.matrix[2][2] - this.matrix[0][2] * this.matrix[2][0]) * invdet;
        result.matrix[1][2] = (this.matrix[1][0] * this.matrix[0][2] - this.matrix[0][0] * this.matrix[1][2]) * invdet;
        result.matrix[2][0] = (this.matrix[1][0] * this.matrix[2][1] - this.matrix[2][0] * this.matrix[1][1]) * invdet;
        result.matrix[2][1] = (this.matrix[2][0] * this.matrix[0][1] - this.matrix[0][0] * this.matrix[2][1]) * invdet;
        result.matrix[2][2] = (this.matrix[0][0] * this.matrix[1][1] - this.matrix[1][0] * this.matrix[0][1]) * invdet;
        return result;
	    }
	}

class Translate extends Transform {
	constructor(x, y) {
		super();
		this.matrix[0][2] = x;
		this.matrix[1][2] = y;
		}
	}

class Scale extends Transform {
	constructor(s) {
		super();
		this.matrix[0][0] = s;
		this.matrix[1][1] = s;
		}
	}

class Rotate extends Transform {
	constructor(th) {
		super();
		this.matrix[0][0] = Math.cos(th);
		this.matrix[0][1] = -Math.sin(th);
		this.matrix[1][0] = Math.sin(th);
		this.matrix[1][1] = Math.cos(th);
		}
	}

class HorizontalFlip extends Transform {
	constructor(th) {
		super();
		this.matrix[1][1] = -1;
		}
	}
