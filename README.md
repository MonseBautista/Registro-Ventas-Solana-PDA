# Registro de Ventas en Solana – Proyecto Mejorado

## 1. Descripción del proyecto

Este proyecto consiste en un sistema de registro de ventas desarrollado mediante **Solana, Rust y Anchor**, que permite administrar un negocio, registrar clientes, realizar ventas, modificar montos y gestionar devoluciones utilizando cuentas PDA (Program Derived Addresses).

El proyecto parte del repositorio base:

[Registro-Ventas-Solana-PDA – WayLearnLatam](https://github.com/WayLearnLatam/Registro-Ventas-Solana-PDA)

## 2. Tecnologías utilizadas

- Solana
- Rust
- Anchor Framework
- TypeScript
- Solana Playground
- GitHub
- Solana Devnet

## 3. Funcionalidades originales

El proyecto incluye las siguientes operaciones:

- Creación del registro del negocio.
- Registro de clientes.
- Registro de ventas.
- Modificación del monto de una venta.
- Devolución de ventas.
- Administración de cuentas mediante PDA.

## 4. Mejoras funcionales implementadas

Se incorporaron mejoras para fortalecer las validaciones y la administración de clientes.

### 4.1 Validación de monto de venta

Se agregó una validación para impedir que se registren ventas con monto igual a cero.

La instrucción utilizada es:

`require!(monto > 0, Errores::MontoInvalido);`

Con esta validación, el programa rechaza operaciones que no cumplen con el monto mínimo permitido.

### 4.2 Baja de clientes

Se agregó la instrucción `dar_baja_cliente`, que permite eliminar un cliente del registro del negocio.

La operación contempla las siguientes condiciones:

- El cliente no debe tener ventas pendientes en su historial.
- El cliente debe encontrarse registrado en el negocio.
- Se elimina su referencia del vector de clientes.
- Se cierra la cuenta PDA del cliente y se devuelve su saldo al propietario.

### 4.3 Nuevos errores

Se incorporaron los siguientes errores personalizados:

- `MontoInvalido`: cuando se intenta registrar una venta con monto cero.
- `ClienteConVentas`: cuando se intenta dar de baja a un cliente con ventas pendientes.
- `ClienteNoRegistrado`: cuando el cliente no se encuentra en el registro.

## 5. Pruebas funcionales

Se preparó un conjunto de pruebas para comprobar las operaciones del sistema:

1. Creación del registro.
2. Creación del cliente.
3. Rechazo de ventas con monto cero.
4. Registro de una venta válida.
5. Rechazo de baja de clientes con ventas pendientes.
6. Devolución de una venta.
7. Baja del cliente sin ventas pendientes.

**Resultado de verificación:** la compilación del programa fue exitosa y el despliegue en Solana Devnet se completó correctamente.

Durante la ejecución de las pruebas se identificó un problema de reconocimiento de la instrucción `darBajaCliente` en el cliente Anchor (IDL). Por ello, la prueba integral quedó pendiente de corrección y nueva ejecución.

## 6. Despliegue

El programa se compiló y desplegó exitosamente en la red **Solana Devnet** mediante Solana Playground.

## 7. ¿Cómo verificar el proyecto?

1. Clonar o descargar este repositorio.
2. Abrir el proyecto en Solana Playground.
3. Revisar el código de `src/lib.rs`.
4. Ejecutar la opción Build para compilar el programa.
5. Revisar `client/client.ts` para conocer las llamadas a las instrucciones.
6. Ejecutar las pruebas de `tests/anchor.test.ts`.
7. Verificar el despliegue en Solana Devnet.

## 8. Conclusión

El proyecto amplía el sistema original de registro de ventas mediante validaciones adicionales y una nueva operación de baja de clientes. Estas mejoras buscan fortalecer la integridad de los datos y evitar operaciones inconsistentes dentro del registro del negocio.

El desarrollo permitió trabajar con contratos inteligentes en Rust, cuentas PDA, validaciones de Anchor y despliegues sobre Solana Devnet.

---

**Proyecto académico – Registro de Ventas en Solana PDA**  

