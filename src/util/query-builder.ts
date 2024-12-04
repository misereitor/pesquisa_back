export const buildUpdateQuery = (table: string, data: Partial<any>) => {
  const keys = Object.keys(data);
  const values = Object.values(data);

  if (keys.length === 0) {
    throw new Error('No fields to update');
  }

  const setString = keys
    .map((key, index) => `${key} = $${index + 1}`)
    .join(', ');

  const text = `UPDATE ${table} SET ${setString} WHERE id = ${data.id} RETURNING *`;

  return { text, values };
};

export const createAssociationCategoriesBuildQuery = (data: Partial<any>) => {
  const keys = Object.keys(data[0]);
  const fields = keys.join(', ');
  const placeholders = [];
  for (let i = 0; i < data.length; i++) {
    const values = Object.values(data[i]);
    placeholders.push(`(${values})`);
  }
  const text = `INSERT INTO category_company_association (${fields}) VALUES ${placeholders} ON CONFLICT (${fields}) DO NOTHING RETURNING *`;
  return { text };
};

export const createCategoriesBuildQuery = (data: Partial<any>) => {
  const keys = Object.keys(data[0]);
  const fields = keys.join(', ');
  const placeholders = [];
  for (let i = 0; i < data.length; i++) {
    const values = Object.values(data[i]);
    placeholders.push(`(${values})`);
  }
  const text = `INSERT INTO category (${fields}) VALUES ${placeholders} RETURNING *`;
  return { text };
};

export const createCompaniesBuildQuery = (data: Partial<any>) => {
  const keys = Object.keys(data[0]);
  const fields = keys.join(', ');
  const placeholders = [];
  for (let i = 0; i < data.length; i++) {
    const values = Object.values(data[i])
      .map((value) => `'${value}'`)
      .join(', ');
    placeholders.push(`(${values})`);
  }
  const text = `INSERT INTO company (${fields}) VALUES ${placeholders} RETURNING *`;
  return { text };
};
