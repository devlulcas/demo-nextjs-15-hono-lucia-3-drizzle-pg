import { z } from 'zod';

export const cursorPaginationSchema = z.object({
	// O número de itens para retornar por página
	limit: z.number().int().min(1).max(150).default(20),
	// O cursor para a paginação (geralmente um ID ou timestamp)
	cursor: z.string().nullable().optional(),
});

export const cursorPaginationResponseSchema = z.object({
	value: z.array(z.any()),
	nextCursor: z.string().nullable(),
	hasNextPage: z.boolean(),
	totalCount: z.number().optional(), // Opcional pois contar todos os items pode ser bem caro
});

export type CursorPagination = z.infer<typeof cursorPaginationSchema>;
export type CursorPaginationResponse<T> = Omit<z.infer<typeof cursorPaginationResponseSchema>, 'value'> & {
	value: T[];
};

export const offsetPaginationSchema = z.object({
	// Página atual, começando em 1 por uma questão de UX
	page: z.number().int().min(1).default(1),
	// Quantidade de itens por página
	pageSize: z.number().int().min(1).max(150).default(20),
});

export const offsetPaginationResponseSchema = z.object({
	value: z.array(z.any()),
	page: z.number(),
	pageSize: z.number(),
	totalPages: z.number(),
	totalItems: z.number(),
	hasNextPage: z.boolean(),
	hasPreviousPage: z.boolean(),
});

export type OffsetPagination = z.infer<typeof offsetPaginationSchema>;
export type OffsetPaginationResponse<T> = Omit<z.infer<typeof offsetPaginationResponseSchema>, 'value'> & {
	value: T[];
};

export function calculatePaginationMetadata(totalItems: number, page: number, pageSize: number) {
	const totalPages = Math.ceil(totalItems / pageSize);

	return {
		page,
		pageSize,
		totalPages,
		totalItems,
		hasNextPage: page < totalPages,
		hasPreviousPage: page > 1,
	};
}

type SqlPaginationResult = {
	limit: number;
	offset: number;
	orderBy?: {
		column: string;
		direction: 'asc' | 'desc';
	};
};

/**
 * Converte parâmetros de paginação baseada em offset para parâmetros SQL
 */
export function toSqlPagination({ page, pageSize }: OffsetPagination): SqlPaginationResult {
	// Calcula o offset (0-based)
	const offset = (page - 1) * pageSize;

	return {
		limit: pageSize,
		offset,
	};
}
