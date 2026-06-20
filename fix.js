
const fs = require('fs');
let lines = fs.readFileSync('src/components/admin/AdminDashboard.tsx', 'utf8').split('\n');
let typeLine = lines.findIndex(l => l.includes('<Select value={form.propertyType}'));
let priceNumericLine = lines.findIndex(l => l.includes('Price (Numeric)'));

const correctCode = [
'            <SelectTrigger><SelectValue /></SelectTrigger>',
'            <SelectContent>',
'              <SelectItem value=\'Apartment\'>Apartment</SelectItem>',
'              <SelectItem value=\'Villa\'>Villa</SelectItem>',
'              <SelectItem value=\'Plot\'>Plot</SelectItem>',
'              <SelectItem value=\'Penthouse\'>Penthouse</SelectItem>',
'              <SelectItem value=\'Commercial\'>Commercial</SelectItem>',
'            </SelectContent>',
'          </Select>',
'        </div>',
'      </div>',
'      <div className=\'grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4\'>'
];

lines.splice(typeLine + 1, priceNumericLine - typeLine - 1, ...correctCode);
fs.writeFileSync('src/components/admin/AdminDashboard.tsx', lines.join('\n'));

