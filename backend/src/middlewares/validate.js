// export function validate(schema, source = 'body') {
//   return (req, res, next) => {
//     try {
//       const parsed = schema.parse(req[source] ?? {});
//       req[source] = parsed;
//       next();
//     } catch (e) {
//       return res.status(400).json({
//         code: 'VALIDATION_ERROR',
//         message: 'Invalid request',
//         details: e.errors?.map(x => ({ path: x.path, message: x.message }))
//       });
//     }
//   };
// }



// backend/src/middlewares/validate.js
import { z } from 'zod';

const toSchema = (arg) => (arg && typeof arg.safeParse === 'function' ? arg : z.object(arg));
const fmt = (issues = []) => issues.map(i => ({ path: i.path.join('.'), message: i.message }));

export function body(schemaLike) {
  const schema = toSchema(schemaLike);
  return (req, res, next) => {
    const r = schema.safeParse(req.body ?? {});
    if (!r.success) {
      return res.status(400).json({
        code: 'VALIDATION_ERROR',
        target: 'body',
        errors: fmt(r.error.issues)
      });
    }
    req.body = r.data;
    next();
  };
}

export function params(schemaLike) {
  const schema = toSchema(schemaLike);
  return (req, res, next) => {
    const r = schema.safeParse(req.params ?? {});
    if (!r.success) {
      return res.status(400).json({
        code: 'VALIDATION_ERROR',
        target: 'params',
        errors: fmt(r.error.issues)
      });
    }
    req.params = r.data;
    next();
  };
}

export function query(schemaLike) {
  const schema = toSchema(schemaLike);
  return (req, res, next) => {
    const r = schema.safeParse(req.query ?? {});
    if (!r.success) {
      return res.status(400).json({
        code: 'VALIDATION_ERROR',
        target: 'query',
        errors: fmt(r.error.issues)
      });
    }
    req.query = r.data;
    next();
  };
}

/**
 * legacy callable: validate(schemaLike [, source='body'])
 * Cho phép dùng: validate(schema)  (mặc định validate body)
 * hoặc:         validate(schema, 'params' | 'query')
 */
function validateFn(schemaLike, source = 'body') {
  const schema = toSchema(schemaLike);
  return (req, res, next) => {
    const r = schema.safeParse((req[source] ?? {}));
    if (!r.success) {
      return res.status(400).json({
        code: 'VALIDATION_ERROR',
        target: source,
        errors: fmt(r.error.issues)
      });
    }
    req[source] = r.data;
    next();
  };
}

// 👉 Default export là HÀM (callable) và có kèm thuộc tính .body/.params/.query
const validate = Object.assign(
  (schemaLike, source = 'body') => validateFn(schemaLike, source),
  { body, params, query }
);

// Named export 'validate' để ai đang dùng `import { validate }` vẫn chạy
export { validate };
export default validate;
