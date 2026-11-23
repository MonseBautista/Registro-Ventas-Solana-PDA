describe("Registro de Ventas - Pruebas funcionales", () => {
  const owner = pg.wallet.publicKey;
  const nombreNegocio = "Prueba" + Date.now();
  const nombreCliente = "Cliente Prueba";
  const sku = "P001";

  function u16ToBytes(valor: number) {
    const buffer = Buffer.alloc(2);
    buffer.writeUInt16LE(valor, 0);
    return buffer;
  }

  function pdaRegistro() {
    return web3.PublicKey.findProgramAddressSync(
      [Buffer.from("registro"), Buffer.from(nombreNegocio), owner.toBuffer()],
      pg.PROGRAM_ID
    )[0];
  }

  function pdaCliente(registro: any, id: number) {
    return web3.PublicKey.findProgramAddressSync(
      [Buffer.from("cliente"), registro.toBuffer(), u16ToBytes(id)],
      pg.PROGRAM_ID
    )[0];
  }

  function pdaVenta(cliente: any) {
    return web3.PublicKey.findProgramAddressSync(
      [Buffer.from("venta"), cliente.toBuffer(), Buffer.from(sku)],
      pg.PROGRAM_ID
    )[0];
  }

  it("Comprueba ventas, validaciones y baja de cliente", async () => {
    const registro = pdaRegistro();

    // 1. Crear registro
    await pg.program.methods
      .crearRegistro(nombreNegocio)
      .accounts({
        owner,
        registro,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();

    console.log("1. Registro creado correctamente");

    // 2. Crear cliente
    const idCliente = 1;
    const cliente = pdaCliente(registro, idCliente);

    await pg.program.methods
      .crearCliente(nombreCliente)
      .accounts({
        owner,
        registro,
        cliente,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();

    console.log("2. Cliente creado correctamente");

    const venta = pdaVenta(cliente);

    // 3. Intentar venta con monto cero
    let ventaRechazada = false;

    try {
      await pg.program.methods
        .registrarVenta(idCliente, sku, "Venta invalida", 0)
        .accounts({
          owner,
          registro,
          cliente,
          venta,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();
    } catch (error) {
      ventaRechazada = true;
      console.log("3. Venta con monto cero rechazada correctamente");
    }

    if (!ventaRechazada) {
      throw new Error("ERROR: Se acepto una venta con monto cero");
    }

    // 4. Registrar venta válida
    await pg.program.methods
      .registrarVenta(idCliente, sku, "Producto de prueba", 50)
      .accounts({
        owner,
        registro,
        cliente,
        venta,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();

    console.log("4. Venta valida registrada correctamente");

    // 5. Intentar baja con venta pendiente
    let bajaRechazada = false;

    try {
      await pg.program.methods
        .darBajaCliente(idCliente)
        .accounts({
          owner,
          registro,
          cliente,
        })
        .rpc();
    } catch (error) {
      bajaRechazada = true;
      console.log("5. Baja rechazada: cliente tiene ventas pendientes");
    }

    if (!bajaRechazada) {
      throw new Error("ERROR: Se permitio eliminar un cliente con ventas");
    }

    // 6. Devolver la venta
    await pg.program.methods
      .hacerDevolucion(idCliente, sku)
      .accounts({
        owner,
        registro,
        cliente,
        venta,
      })
      .rpc();

    console.log("6. Devolucion realizada correctamente");

    // 7. Dar de baja al cliente
    await pg.program.methods
      .darBajaCliente(idCliente)
      .accounts({
        owner,
        registro,
        cliente,
      })
      .rpc();

    console.log("7. Cliente dado de baja correctamente");

    // 8. Verificar que ya no aparece en el registro
    const registroFinal = await pg.program.account.registro.fetch(registro);

    if (registroFinal.clientes.length !== 0) {
      throw new Error("ERROR: El cliente sigue registrado");
    }

    console.log("8. Verificacion final correcta");
    console.log("TODAS LAS PRUEBAS FUNCIONALES FINALIZARON");
  });
});
