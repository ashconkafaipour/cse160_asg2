class Cube {
    constructor() {
        this.type = 'cube';
        //this.position = [0.0, 0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];
        //this.size = 5.0;
        //this.segment = 5;
        this.matrix = new Matrix4();
    }

    render() {
        //var xy = this.position;
        var rgba = this.color;
        //var size = this.size;
        

        // Pass color to fragment shader
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        // Pass the matrix to u_ModelMatrix attribute
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        // Front of cube
        drawTriangle3D([0.0,0.0,0.0, 1.0,1.0,0.0, 1.0,0.0,0.0]);
        drawTriangle3D([0.0,0.0,0.0, 0.0,1.0,0.0, 1.0,1.0,0.0]);

        // Pass the color of a point to u_FragColor uniform variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        // Top of cube
        drawTriangle3D([0.0,1.0,0.0, 0.0,1.0,1.0, 1.0,1.0,1.0]);  
        drawTriangle3D([0.0,1.0,0.0, 1.0,1.0,1.0, 1.0,1.0,0.0]);  

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        // Right of cube
        drawTriangle3D( [1,0,0,  1,1,0,  1,1,1]);
        drawTriangle3D( [1,0,0,  1,1,1,  1,0,1]);

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        // Bottom of cube
        drawTriangle3D( [0,0,0,  0,0,1,  1,0,1]);
        drawTriangle3D( [0,0,0,  1,0,1,  1,0,0]);

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        // Left of cube
        drawTriangle3D( [0,0,0,  0,1,0,  0,1,1]);
        drawTriangle3D( [0,0,0,  0,1,1,  0,0,1]);

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        // Back of cube
        drawTriangle3D( [0.0,0.0,1.0,  1.0,1.0,1.0,  1.0,0.0,1.0] );
        drawTriangle3D( [0.0,0.0,1.0,  0.0,1.0,1.0,  1.0,1.0,1.0] );
    }
}
